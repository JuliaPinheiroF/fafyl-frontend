import { useNavigate } from 'react-router-dom';
import React from 'react';
import { motion } from 'framer-motion';
import Corrossel from '@/components/ui/corrossel';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import SwipeablePage from '@/components/layout/SwipeablePage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <Background
      title="FAFYL"
      headerAction={
        <button
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-primary-foreground/15 flex items-center justify-center cursor-pointer border-none active:scale-90 hover:bg-primary-foreground/25 transition-all"
          aria-label="Ver perfil"
        >
          <svg width={18} height={18} viewBox="0 0 16 16">
            <path fill="white" d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path fill="white" fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
          </svg>
        </button>
      }
    >
      <PageTransition>
        <SwipeablePage>
          <motion.div
            className="p-5 pb-2 space-y-7"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >

            {/* BANNER */}
            <motion.div
              variants={fadeUp}
              className="rounded-2xl p-5 relative overflow-hidden border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent"
            >
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
                Bem-vindo
              </p>
              <h2 className="text-xl font-bold text-primary leading-snug mb-1">
                Qual curso combina<br />com você?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Descubra universidades e cursos alinhados ao seu perfil.
              </p>
            </motion.div>

            {/* CARROSSEL */}
            <motion.section variants={fadeUp} className="-mx-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-5">
                Universidades em destaque
              </p>
              <Corrossel onViewCollege={(id) => navigate(`/busca/${id}/faculdade`)} />
            </motion.section>

            {/* QUIZ CTA */}
            <motion.section variants={fadeUp}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Faça nosso Quiz Indicador
              </p>
              <div
                onClick={() => navigate('/quiz')}
                className="w-full rounded-2xl p-5 flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer gold-gradient shadow-[var(--shadow-glow-gold)]"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent-foreground/15">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.8" className="text-accent-foreground"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-base font-bold text-accent-foreground leading-tight mb-1">Iniciar quiz</p>
                  <p className="text-xs text-accent-foreground/60 leading-relaxed">
                    Responda e encontre cursos certos para você
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent-foreground/15 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground"/>
                  </svg>
                </div>
              </div>
            </motion.section>

            {/* CHATBOT CTA */}
            <motion.section variants={fadeUp}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Assistente
              </p>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-primary/5">
                    <img
                      src="/images/curioso.png"
                      className="w-9 h-9 rounded-lg object-contain"
                      alt="Capelinho"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">Capelinho</p>
                    <p className="text-xs text-accent font-medium">Assistente FAFYL</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Tem dúvidas sobre cursos ou universidades? Estou aqui para ajudar você a escolher o melhor caminho.
                </p>

                <Button size="lg" className="w-full" onClick={() => navigate('/busca/chatbot')}>
                  Iniciar conversa
                </Button>
              </Card>
            </motion.section>

          </motion.div>
        </SwipeablePage>
      </PageTransition>
    </Background>
  );
}
