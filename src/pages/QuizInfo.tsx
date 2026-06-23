import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ComoFunciona() {
  const navigate = useNavigate();

  return (
    <Background title="Quiz" showBackButton>
      <PageTransition>
        <SwipeablePage>
          <motion.div
            className="p-6 flex flex-col items-center gap-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-lg font-semibold text-foreground"
              variants={fadeUp}
            >
              Como funciona o nosso quiz
            </motion.h2>
            <motion.div className="flex-1 w-full" variants={fadeUp}>
              <Card className="w-full h-full p-6 rounded-3xl bg-muted/50">
                <div className="h-full overflow-y-auto">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Responda a uma sequência de perguntas, que exploram aspectos como interesses pessoais, afinidade com disciplinas escolares, habilidades cognitivas e comportamentais e expectativas em relação ao futuro profissional.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                    Nosso Quiz orientador é uma experiência interativa para guiar estudantes no processo de decisão sobre qual curso superior seguir.
                  </p>
                </div>
              </Card>
            </motion.div>
            <Button variant="accent" size="lg" className="w-64" onClick={() => navigate('/quiz')}>
              Continuar
            </Button>
          </motion.div>
        </SwipeablePage>
      </PageTransition>
    </Background>
  );
}
