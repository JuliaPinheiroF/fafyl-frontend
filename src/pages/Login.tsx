import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Background from '@/components/layout/background';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LoginScreen() {
  const navigate = useNavigate();

  return (
    <Background>
      <PageTransition>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            className="w-full max-w-md"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader className="text-center">
                <motion.h1
                  className="text-3xl font-bold text-primary"
                  variants={fadeUp}
                >
                  FAFYL
                </motion.h1>
                <motion.div variants={fadeUp}>
                  <CardDescription>Entre na sua conta</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div className="space-y-2" variants={fadeUp}>
                  <label className="text-sm font-medium text-foreground">E-mail</label>
                  <Input type="email" placeholder="seu@email.com" />
                </motion.div>
                <motion.div className="space-y-2" variants={fadeUp}>
                  <label className="text-sm font-medium text-foreground">Senha</label>
                  <Input type="password" placeholder="Sua senha" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button variant="accent" size="lg" className="w-full" onClick={() => navigate('/home', { replace: true })}>
                    Entrar
                  </Button>
                </motion.div>
                <motion.div className="text-center" variants={fadeUp}>
                  <button
                    onClick={() => navigate('/')}
                    className="text-sm text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none"
                  >
                    Não tem uma conta?{' '}
                    <span className="font-semibold text-primary">Cadastre-se</span>
                  </button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageTransition>
    </Background>
  );
}
