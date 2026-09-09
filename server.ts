import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleAuth } from "google-auth-library";
import { 
  GOOGLE_PROJECT_ID,
  DATA_AGENT_LOCATION,
  getAgentConfig
} from "./agent.config.js";
import { PRESET_QUESTIONS } from "./src/ui.config.js";
import { getDexIntelligenceResponse } from "./server/dexIntelligence.js";

dotenv.config();

const PORT = 3000;

const auth = new GoogleAuth({
  scopes: "https://www.googleapis.com/auth/cloud-platform",
});

async function getAuthHeaders(projectId: string) {
  const client = await auth.getClient();
  const accessTokenResponse = await client.getAccessToken();
  const accessToken = accessTokenResponse.token;

  if (!accessToken) throw new Error("Failed to retrieve access token");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
    "x-goog-user-project": projectId,
  };
}

const checkedAgents = new Set<string>();

async function ensureDataAgentExists(headers: any, projectId: string) {
  const { agentId, fullAgentName, payload } = getAgentConfig(projectId);
  if (checkedAgents.has(fullAgentName)) return fullAgentName;

  const newAgentUrl = `https://geminidataanalytics.googleapis.com/v1beta/${fullAgentName}`;
  try {
    const checkResponse = await axios.get(newAgentUrl, { headers });
    if (checkResponse.status === 200) {
      checkedAgents.add(fullAgentName);
      return fullAgentName;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        const createUrl = `https://geminidataanalytics.googleapis.com/v1beta/projects/${projectId}/locations/${DATA_AGENT_LOCATION}/dataAgents`;
        await axios.post(createUrl, payload, { headers, params: { data_agent_id: agentId } });
        checkedAgents.add(fullAgentName);
        return fullAgentName;
      } catch (createError: any) {
        throw createError;
      }
    } else {
      throw error;
    }
  }
  return fullAgentName;
}

const DataAgentService = {
  async createConversation(headers: any, projectId: string, fullAgentName: string) {
    const url = `https://geminidataanalytics.googleapis.com/v1beta/projects/${projectId}/locations/${DATA_AGENT_LOCATION}/conversations`;
    const payload = { agents: [fullAgentName] };
    const response = await axios.post(url, payload, { headers });
    return response.data.name;
  },

  async sendMessage(conversationName: string, query: string, headers: any, projectId: string, fullAgentName: string) {
    const url = `https://geminidataanalytics.googleapis.com/v1beta/projects/${projectId}/locations/${DATA_AGENT_LOCATION}:chat`;
    const payload = {
      project: `projects/${projectId}`,
      messages: [{ userMessage: { text: query } }],
      conversationReference: {
        conversation: conversationName,
        dataAgentContext: { dataAgent: fullAgentName },
      },
    };
    const response = await axios.post(url, payload, { headers });
    return response.data;
  },
};

async function handleQueryError(error: any, res: express.Response, projectId: string) {
  let serviceAccount = "unknown";
  try {
    const credentials = await auth.getCredentials();
    serviceAccount = credentials.client_email || "ADC / Metadata Server";
  } catch (e) {}

  let status = 500;
  let message = "Internal Server Error";
  let details: any = error.message;

  if (axios.isAxiosError(error)) {
    status = error.response?.status || 500;
    const data = error.response?.data;
    message = "Failed to query Data Agent";
    details = data?.error?.message || data?.error || error.message;

      // Note: We use 400 instead of 403 here because the AI Studio environment's 
      // reverse proxy intercepts 403 responses for its own authentication flow.
      // Returning 400 ensures this JSON error payload reaches the frontend intact.
    if (status === 403) {
      status = 400; // AI Studio Proxy Bypass
      message = "Permission Denied";
      details = `**Service Account:** \`${serviceAccount}\`\n\n**Project ID:** \`${projectId}\`\n\n**Error:** ${data?.error?.message || error.message}`;
    }
  }

  const detailsText = typeof details === 'string' ? details : "```json\n" + JSON.stringify(details, null, 2) + "\n```";
  const errorText = `### Error (${status}): ${message}\n\n${detailsText}`;
  res.status(status).json({ error: { code: status, message, details: detailsText, formattedText: errorText } });
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/api/service-account", async (req, res) => {
    try {
      const credentials = await auth.getCredentials();
      res.json({ serviceAccount: credentials.client_email || "ADC / Metadata Server" });
    } catch (e) {
      res.status(500).json({ error: "Could not retrieve service account" });
    }
  });

  app.post("/api/query", async (req, res) => {
    const { query, conversationId, customProjectId } = req.body;

    if (!query) return res.status(400).json({ error: "Query is required" });

    const projectId = customProjectId && customProjectId.trim() !== "" ? customProjectId : GOOGLE_PROJECT_ID;

    // If no GCP Project ID is provided or it's a DEX intelligence query, provide structured DEX insights
    if (!projectId) {
      const dexData = getDexIntelligenceResponse(query);
      return res.json({
        data: { data: dexData },
        conversationId: conversationId || `dex-conv-${Date.now()}`
      });
    }

    if (projectId === GOOGLE_PROJECT_ID) {
      if (!PRESET_QUESTIONS.includes(query.trim())) {
        const dexData = getDexIntelligenceResponse(query);
        return res.json({
          data: { data: dexData },
          conversationId: conversationId || `dex-conv-${Date.now()}`
        });
      }
    }

    try {
      const headers = await getAuthHeaders(projectId);
      let activeConversationId = conversationId;
      
      const fullAgentName = await ensureDataAgentExists(headers, projectId);

      if (!activeConversationId) {
        activeConversationId = await DataAgentService.createConversation(headers, projectId, fullAgentName);
      }

      const responseData = await DataAgentService.sendMessage(activeConversationId, query, headers, projectId, fullAgentName);

      res.json({ data: responseData, conversationId: activeConversationId });
    } catch (error: any) {
      // If BigQuery Agent fails, fall back to DEX intelligence response
      try {
        const dexData = getDexIntelligenceResponse(query);
        return res.json({
          data: { data: dexData },
          conversationId: conversationId || `dex-conv-${Date.now()}`
        });
      } catch (fallbackError) {
        await handleQueryError(error, res, projectId);
      }
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server is running on port ${PORT}`));
}

startServer();
