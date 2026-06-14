import Background from '@/components/layout/background';
import { IoTimeOutline, IoPencil } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCapelinhoImage, getUserCapelinho } from '@/services/capelinhoService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PageTransition from '@/components/layout/PageTransition';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Profile() {
  const navigate = useNavigate();
  const [capelinhoId, setCapelinhoId] = useState<number | null>(null);

  useEffect(() => {
    getUserCapelinho().then(setCapelinhoId);
  }, []);

  const avatarImage = getCapelinhoImage(capelinhoId);

  return (
    <Background title="Meu Perfil" showBackButton>
      <PageTransition>
        <motion.div
          className="flex-1 flex flex-col items-center pt-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-col items-center mb-6" variants={fadeUp}>
            <div className="w-28 h-28 rounded-full border-4 border-primary flex items-center justify-center mb-4 overflow-hidden bg-card animate-scale-in">
              <img
                src={avatarImage}
                className="w-24 h-24 object-contain hover:scale-110 transition-transform duration-300"
                alt=""
              />
            </div>
              <Button
                variant="outline"
                className="rounded-full px-5 gap-1.5"
                onClick={() => navigate('/profile/capelinhos')}
              >
                <IoPencil size={14} />
                Alterar foto
              </Button>
          </motion.div>

          <motion.div className="w-full flex-1" variants={fadeUp}>
            <Card className="rounded-t-3xl h-full">
              <CardContent className="p-6 space-y-4">
                <Input placeholder="User" className="h-12" />
                <Input placeholder="Nome" className="h-12" />
                <Input placeholder="E-mail" className="h-12" type="email" />
                <Input placeholder="CEP" className="h-12" type="text" inputMode="numeric" maxLength={8} />

                  <Button
                    variant="accent" size="lg" className="w-full gap-2"
                    onClick={() => navigate('/profile/historico')}
                  >
                    <IoTimeOutline size={18} />
                    Histórico de resultados
                  </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </PageTransition>
    </Background>
  );
}
