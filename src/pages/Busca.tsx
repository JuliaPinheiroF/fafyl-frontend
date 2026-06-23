import { IoSchool, IoBook } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import React from 'react';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import SwipeablePage from '@/components/layout/SwipeablePage';

export default function BuscaScreen() {
  const navigate = useNavigate();

  return (
    <Background title="Buscar">
      <PageTransition>
        <SwipeablePage>
          <div className="flex-1 p-6 flex flex-col items-center pt-12">
            <motion.h2
              className="text-xl font-semibold text-foreground mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              O que você procura?
            </motion.h2>

            <motion.div
              className="flex justify-center w-full gap-4 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <button
                className="flex-1 bg-primary rounded-2xl py-10 flex flex-col items-center justify-center cursor-pointer border-none shadow-[var(--shadow-card)] hover:bg-primary/90 transition-all hover:scale-[1.04] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.96]"
                onClick={() => navigate('/busca/faculdades')}
              >
                <IoSchool size={40} color="#FFD700" />
                <span className="text-sm font-bold text-accent mt-3">Faculdades</span>
              </button>
              <button
                className="flex-1 bg-primary rounded-2xl py-10 flex flex-col items-center justify-center cursor-pointer border-none shadow-[var(--shadow-card)] hover:bg-primary/90 transition-all hover:scale-[1.04] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.96]"
                onClick={() => navigate('/busca/cursos')}
              >
                <IoBook size={40} color="#FFD700" />
                <span className="text-sm font-bold text-accent mt-3">Cursos</span>
              </button>
            </motion.div>
          </div>
        </SwipeablePage>
      </PageTransition>
    </Background>
  );
}
