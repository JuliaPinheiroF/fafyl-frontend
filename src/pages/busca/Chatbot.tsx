import Background from '@/components/layout/background';
import { sendChatMessage } from '@/services/chatbotService';
import { ChatMessage } from '@/types';
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const messageVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25 } },
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: trimmed,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendChatMessage(trimmed);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: reply,
        role: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Erro ao enviar mensagem. Tente novamente.',
        role: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <Background title="Capelinho" showBackButton>
      <PageTransition>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 py-16">
                <img src="/images/curioso.png" className="w-16 h-16 rounded-full object-contain opacity-60" alt="" />
                <p className="text-sm">Digite uma mensagem para começar</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg) =>
                  msg.role === 'user' ? (
                    <motion.div
                      key={msg.id}
                      className="flex justify-end"
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                    >
                      <div className="bg-primary rounded-2xl rounded-br-sm px-4 py-2.5 max-w-[80%]">
                        <span className="text-primary-foreground text-sm">{msg.text}</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={msg.id}
                      className="flex items-end gap-2"
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      layout
                    >
                      <img
                        src="/images/curioso.png"
                        className="w-8 h-8 rounded-full object-contain shrink-0"
                        alt=""
                      />
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5 max-w-[75%]">
                        <span className="text-foreground text-sm">{msg.text}</span>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            )}
            {loading && (
              <motion.div
                className="flex items-end gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img src="/images/curioso.png" className="w-8 h-8 rounded-full object-contain shrink-0" alt="" />
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2.5">
                  <span className="text-foreground text-sm inline-block animate-pulse">
                    pensando...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <motion.div
            className="flex items-end gap-2 p-4 border-t border-border"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Input
              className="flex-1 rounded-2xl bg-background min-h-[44px]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              maxLength={500}
            />
            <div className="active:scale-90 transition-transform">
              <Button
                className="w-12 h-12 rounded-full shrink-0 bg-primary hover:bg-primary/90 text-accent text-xl font-bold"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
              >
                {loading ? (
                  <span className="inline-block animate-spin">↻</span>
                ) : '→'}
              </Button>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </Background>
  );
}
