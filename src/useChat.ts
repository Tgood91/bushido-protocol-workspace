import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { Message, Conversation } from "./types";
import { INITIAL_MESSAGE, STORAGE_KEY } from "./ui.config";

export const useChat = () => {
  const [customProjectId, setCustomProjectId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });

  const saveCustomProjectId = useCallback((id: string) => {
    setCustomProjectId(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    return [{
      id: crypto.randomUUID(),
      title: "New Conversation",
      messages: [{ ...INITIAL_MESSAGE, timestamp: new Date() }],
      conversationId: null,
      timestamp: new Date()
    }];
  });

  const [currentConvId, setCurrentConvId] = useState<string>(conversations[0]?.id);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [computingIds, setComputingIds] = useState<Set<string>>(new Set());
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const currentConversation = conversations.find(c => c.id === currentConvId) || conversations[0];
  const messages = currentConversation.messages;
  const isLoading = loadingIds.has(currentConvId);
  const isComputing = computingIds.has(currentConvId);

  const simulateStreaming = useCallback(async (responseParts: any[], messageId: string, convId: string) => {
    if (!Array.isArray(responseParts)) {
      setConversations(prev => prev.map(c => 
        c.id === convId 
          ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, content: [responseParts], status: "done" } : m) }
          : c
      ));
      return;
    }

    for (const part of responseParts) {
      setConversations(prev => prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            messages: c.messages.map(m => {
              if (m.id === messageId) {
                const content = Array.isArray(m.content) ? m.content : [];
                return { ...m, content: [...content, part], status: "streaming" };
              }
              return m;
            })
          };
        }
        return c;
      }));
      const delay = part.systemMessage?.text?.textType === "THOUGHT" ? 1000 : 500;
      await new Promise(r => setTimeout(r, delay));
    }

    setConversations(prev => prev.map(c => 
      c.id === convId 
        ? { ...c, messages: c.messages.map(m => m.id === messageId ? { ...m, status: "done" } : m) }
        : c
    ));
  }, []);

  const handleSend = useCallback(async (text: string, passedProjectId?: string) => {
    if (!text.trim() || loadingIds.has(currentConvId)) return;

    const convId = currentConvId;
    const controller = new AbortController();
    abortControllers.current.set(convId, controller);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date() };
    
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        let newTitle = c.title;
        if (c.title === "New Conversation") {
          newTitle = text.slice(0, 30) + (text.length > 30 ? "..." : "");
        }
        return { ...c, title: newTitle, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    setLoadingIds(prev => new Set(prev).add(convId));
    const computingTimer = setTimeout(() => {
      setComputingIds(prev => new Set(prev).add(convId));
    }, 2000);

    try {
      const response = await axios.post("/api/query", { 
        query: text, 
        conversationId: currentConversation.conversationId,
        customProjectId: passedProjectId !== undefined ? passedProjectId : customProjectId
      }, { signal: controller.signal });

      clearTimeout(computingTimer);
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(convId);
        return next;
      });
      setComputingIds(prev => {
        const next = new Set(prev);
        next.delete(convId);
        return next;
      });

      if (response.data.conversationId) {
        setConversations(prev => prev.map(c => 
          c.id === convId ? { ...c, conversationId: response.data.conversationId } : c
        ));
      }

      const assistantId = crypto.randomUUID();
      setConversations(prev => prev.map(c => 
        c.id === convId ? { ...c, messages: [...c.messages, { id: assistantId, role: "assistant", content: [], status: "streaming", timestamp: new Date() }] } : c
      ));
      
      const parts = response.data.data?.data || response.data.data || [];
      await simulateStreaming(parts, assistantId, convId);
      
    } catch (e: any) {
      clearTimeout(computingTimer);
      if (axios.isCancel(e)) return;

      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(convId);
        return next;
      });
      setComputingIds(prev => {
        const next = new Set(prev);
        next.delete(convId);
        return next;
      });
      
      const backendError = e.response?.data?.error;
      const errorMessage = backendError?.formattedText 
        || backendError?.message 
        || (typeof backendError === 'string' ? backendError : null)
        || e.message 
        || "Unknown error occurred";

      setConversations(prev => prev.map(c => 
        c.id === convId ? { 
          ...c, 
          messages: [...c.messages, {
            id: crypto.randomUUID(),
            role: "assistant",
            content: errorMessage,
            status: "done",
            timestamp: new Date()
          }] 
        } : c
      ));
    } finally {
      abortControllers.current.delete(convId);
    }
  }, [currentConvId, loadingIds, currentConversation.conversationId, customProjectId, simulateStreaming]);

  const handleStop = useCallback(() => {
    abortControllers.current.get(currentConvId)?.abort();
    setLoadingIds(prev => {
      const next = new Set(prev);
      next.delete(currentConvId);
      return next;
    });
    setComputingIds(prev => {
      const next = new Set(prev);
      next.delete(currentConvId);
      return next;
    });
  }, [currentConvId]);

  const handleNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    const newConv = { id, title: "New Conversation", messages: [{ ...INITIAL_MESSAGE, timestamp: new Date() }], conversationId: null, timestamp: new Date() };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConvId(id);
  }, []);

  const handleSelectConversation = (id: string) => {
    setCurrentConvId(id);
  };

  const handleDeleteConversation = (id: string) => {
    if (loadingIds.has(id)) {
      abortControllers.current.get(id)?.abort();
    }
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      
      if (currentConvId === id) {
        const nextId = filtered.length > 0 ? filtered[0].id : null;
        if (nextId) setCurrentConvId(nextId);
      }
      
      if (filtered.length === 0) {
        const newId = crypto.randomUUID();
        setCurrentConvId(newId);
        return [{ id: newId, title: "New Conversation", messages: [{ ...INITIAL_MESSAGE, timestamp: new Date() }], conversationId: null, timestamp: new Date() }];
      }
      return filtered;
    });
  };

  return {
    messages,
    conversations,
    currentConvId,
    isLoading,
    isComputing,
    handleSend,
    handleStop,
    handleNewChat,
    handleSelectConversation,
    handleDeleteConversation,
    loadingIds,
    customProjectId,
    saveCustomProjectId
  };
};
