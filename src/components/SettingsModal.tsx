import React, { useState, useEffect } from 'react';
import { X, Settings, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  onSave: (projectId: string) => void;
}

export function SettingsModal({ isOpen, onClose, currentProjectId, onSave }: SettingsModalProps) {
  const [projectId, setProjectId] = useState(currentProjectId);
  const [serviceAccount, setServiceAccount] = useState("Loading...");

  useEffect(() => {
    setProjectId(currentProjectId);
  }, [currentProjectId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/service-account')
        .then(res => res.json())
        .then(data => {
          if (data.serviceAccount) {
            setServiceAccount(data.serviceAccount);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSave = () => {
    onSave(projectId.trim());
    onClose();
  };

  const handleRevert = () => {
    setProjectId('');
    onSave('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-[#0F0F0F] border border-[#141414]/10 dark:border-white/10 rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#141414]/10 dark:border-white/10 bg-[#141414]/5 dark:bg-white/5">
                <h2 className="font-semibold text-lg flex items-center gap-2 dark:text-white">
                  <Settings className="w-5 h-5" />
                  GCP Project Configuration
                </h2>
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-md text-sm border border-blue-200 dark:border-blue-800/30 leading-relaxed">
                  To ask custom questions, you must provide your own Google Cloud Project ID.
                </div>
                
                <div className="space-y-4 text-sm text-[#141414]/80 dark:text-white/80">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Required APIs enabled in your project:</h3>
                    <ul className="list-disc pl-8 space-y-1 font-mono text-xs">
                      <li>geminidataanalytics.googleapis.com</li>
                      <li>cloudaicompanion.googleapis.com</li>
                      <li>bigquery.googleapis.com</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-2"><ShieldAlert className="w-4 h-4 text-orange-500" /> Required Roles for Service Account:</h3>
                    <div className="bg-[#141414]/5 dark:bg-white/5 p-2 rounded text-xs font-mono break-all mb-2">
                      {serviceAccount}
                    </div>
                    <ul className="list-disc pl-8 space-y-1 font-mono text-xs">
                      <li>roles/bigquery.dataViewer</li>
                      <li>roles/bigquery.jobUser</li>
                      <li>roles/geminidataanalytics.dataAgentCreator</li>
                      <li>roles/geminidataanalytics.dataAgentUser</li>
                      <li>roles/cloudaicompanion.user</li>
                      <li>roles/serviceusage.serviceUsageConsumer</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold dark:text-white">Google Cloud Project ID</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Enter your GCP Project ID"
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1A1A] border border-[#141414]/20 dark:border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2EDF9D]/50 dark:text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSave();
                      }
                    }}
                    autoFocus
                  />
                </div>
              </div>

              <div className="p-4 border-t border-[#141414]/10 dark:border-white/10 bg-[#141414]/5 dark:bg-white/5 flex items-center justify-between gap-4">
                <button 
                  onClick={handleRevert}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Revert to Default
                </button>
                <div className="flex gap-2">
                  <button onClick={onClose} className="px-4 py-2 rounded-md text-sm font-medium border border-[#141414]/20 dark:border-white/20 hover:bg-[#141414]/5 dark:hover:bg-white/5 transition-colors dark:text-white">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-md text-sm font-medium bg-[#141414] text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
