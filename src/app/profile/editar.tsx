import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function EditarProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Background title="Editar Perfil" showBackButton>
      <PageTransition>
        <motion.div
          className="flex-1 p-6 space-y-5"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-2" variants={fadeUp}>
            <label className="text-sm font-medium text-foreground">Nome</label>
            <Input
              className="h-12"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </motion.div>
          <motion.div className="space-y-2" variants={fadeUp}>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              className="h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              type="email"
            />
          </motion.div>
          <motion.div variants={fadeUp} className="hover:scale-[1.02] active:scale-[0.97] transition-transform">
            <Button className="w-full h-12 rounded-xl font-semibold">
              Salvar
            </Button>
          </motion.div>
        </motion.div>
      </PageTransition>
    </Background>
  );
}
