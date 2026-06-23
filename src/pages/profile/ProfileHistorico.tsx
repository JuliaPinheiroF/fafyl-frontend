import Background from '@/components/layout/background';
import { IoClipboardOutline, IoBook, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HistoryEntry, getHistory, formatDate } from '@/services/historyService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PageTransition from '@/components/layout/PageTransition';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function HistoricoScreen() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const handleViewCourse = (courseId: number) => {
    navigate(`/busca/${courseId}/curso`);
  };

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-muted-foreground animate-pulse">
              Carregando histórico...
            </span>
          </div>
        </PageTransition>
      </Background>
    );
  }

  if (history.length === 0) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="animate-scale-in">
              <IoClipboardOutline size={48} className="text-muted-foreground/30 mb-4" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2 animate-fade-in">
              Nenhum resultado ainda
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs animate-fade-in">
              Faça o quiz para receber recomendações de cursos.
            </p>
            <Button variant="accent" onClick={() => navigate('/quiz')}>
              Fazer quiz
            </Button>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton>
      <PageTransition>
        <div className="flex-1">
          <div className="text-center pt-4 pb-2">
            <h2 className="text-lg font-bold text-primary">Histórico de Resultados</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {history.length} resultado{history.length > 1 ? 's' : ''} encontrado{history.length > 1 ? 's' : ''}
            </p>
          </div>

          <motion.div
            className="px-4 pb-24 space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {history.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="p-4 rounded-2xl">
                  <button
                    className="w-full text-left cursor-pointer border-none bg-transparent active:scale-[0.99] transition-transform"
                    onClick={() => handleViewCourse(item.course.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0 hover:rotate-12 transition-transform">
                        <IoBook size={20} className="text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">{item.course.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(item.accessedAt)}</p>
                      </div>
                      <div className="shrink-0 group-hover:translate-x-1 transition-transform">
                        <IoChevronForward size={18} className="text-primary shrink-0" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed ml-14">{item.course.description}</p>
                  </button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </PageTransition>
    </Background>
  );
}
