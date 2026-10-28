import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, Clock, RefreshCw, Eye } from 'lucide-react';
import { EmailNotification } from '../types';
import { api } from '../services/api';

interface EmailViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailNotificationViewerModal: React.FC<EmailViewerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<EmailNotification[]>([]);
  const [selectedLog, setSelectedLog] = useState<EmailNotification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.getRecentNotifications();
      setLogs(res.notifications);
      if (res.notifications.length > 0 && !selectedLog) {
        setSelectedLog(res.notifications[0]);
      }
    } catch (err) {
      console.error('Failed to load email logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-5xl bg-[#121b27] border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col h-[88vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-[#0d1520]/90">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface border border-accent/40 text-accent">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="label-tag text-accent font-semibold">EMAIL NOTIFICATION ENGINE</span>
                <h2 className="text-xl font-headline font-bold text-white">Live Dispatched Emails & Delivery Logs</h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLogs}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white transition-colors"
                title="Refresh logs"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-accent' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-surface hover:bg-surface-raised border border-border text-muted-foreground hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body: Two columns (Left: list of emails, Right: email preview) */}
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
            
            {/* Email List (5 cols) */}
            <div className="md:col-span-5 border-r border-border overflow-y-auto bg-surface/50 p-4 space-y-2">
              <div className="flex items-center justify-between pb-2">
                <span className="label-tag text-muted-foreground">Recent Dispatched Emails ({logs.length})</span>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SMTP Active</span>
                </span>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground">
                  No email notifications dispatched yet. Submit or update a booking to trigger notifications!
                </div>
              ) : (
                logs.map((log) => (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                      selectedLog?.id === log.id
                        ? 'border-accent bg-accent/10 shadow-sm'
                        : 'border-border/70 bg-surface hover:border-accent/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white truncate max-w-[200px]">
                        {log.recipient_name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(log.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-xs text-accent font-medium truncate">
                      {log.subject}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate max-w-[180px]">{log.recipient_email}</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {log.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Email Rendered Preview (7 cols) */}
            <div className="md:col-span-7 bg-[#0b1118] flex flex-col overflow-hidden">
              {selectedLog ? (
                <div className="flex flex-col h-full">
                  {/* Meta Bar */}
                  <div className="p-4 border-b border-border/80 bg-surface/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-semibold text-white">
                        {selectedLog.recipient_name} &lt;{selectedLog.recipient_email}&gt;
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Subject:</span>
                      <span className="font-bold text-accent">{selectedLog.subject}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Booking Reference: {selectedLog.booking_id || 'N/A'}</span>
                      <span>Dispatched: {new Date(selectedLog.sent_at).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rendered HTML inside iframe or sandboxed container */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <iframe
                      title="Email Preview"
                      srcDoc={selectedLog.body_html}
                      className="w-full h-full min-h-[500px] border border-border rounded-lg bg-[#0e1620]"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs p-8 text-center">
                  <Eye className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p>Select an email from the left column to preview its formatted responsive HTML presentation.</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

