import React from 'react';
import { motion } from 'framer-motion';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import SwipeablePage from '@/components/layout/SwipeablePage';
import { Card } from '@/components/ui/card';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SobreNos() {
  return (
    <Background title="Sobre">
      <PageTransition>
        <SwipeablePage>
          <motion.div
            className="p-6 flex flex-col items-center gap-4"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
          <motion.h2
            className="text-xl font-bold text-foreground"
            variants={fadeUp}
          >
            Sobre nós
          </motion.h2>
          <motion.div className="flex-1 w-full" variants={fadeUp}>
            <Card className="w-full h-full p-5">
              <div className="h-full overflow-y-auto">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Nós, com o objetivo de orientar pessoas na escolha de suas futuras trajetórias acadêmicas, desenvolvemos o FAFYL.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  A plataforma foi criada para auxiliar na tomada de decisão de forma mais clara e prática, reunindo informações relevantes sobre cursos e instituições de ensino. Por meio de um questionário objetivo, o sistema analisa o perfil, interesses e preferências do usuário, indicando possibilidades de graduação mais alinhadas com suas características.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  O FAFYL é direcionado principalmente a adolescentes e jovens adultos que ainda estão em dúvida sobre qual curso seguir, oferecendo um apoio inicial para essa escolha tão importante.
                </p>
              </div>
            </Card>
          </motion.div>
          <motion.div variants={fadeUp}>
            <Card className="w-full p-4 flex items-center justify-center flex-col">
              <h3 className="text-sm font-bold text-primary mb-1">Grupo:</h3>
              <span className="text-xs text-muted-foreground text-center">Angelina, Henrique, Júlia, Ruan, Ryan e Victor M.</span>
            </Card>
          </motion.div>
        </motion.div>
        </SwipeablePage>
      </PageTransition>
    </Background>
  );
}
