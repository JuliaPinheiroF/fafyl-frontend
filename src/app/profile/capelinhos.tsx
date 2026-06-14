import Background from '@/components/layout/background';
import { IoReload } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { updateCapelinho, getUserCapelinho, CAPELINHO_IMAGES } from '@/services/capelinhoService';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const AVATARES = [
  { id: 1, img: CAPELINHO_IMAGES[1] },
  { id: 2, img: CAPELINHO_IMAGES[2] },
  { id: 3, img: CAPELINHO_IMAGES[3] },
  { id: 4, img: CAPELINHO_IMAGES[4] },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SelecionarAvatar() {
  const navigate = useNavigate();
  const [selecionado, setSelecionado] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserCapelinho().then((id) => {
      if (id) setSelecionado(id);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCapelinho(selecionado);
    } catch (e) {
      console.error('Failed to update capelinho:', e);
    } finally {
      setSaving(false);
      navigate(-1);
    }
  };

  return (
    <Background title="Escolher Avatar" showBackButton>
      <PageTransition>
        <motion.div
          className="flex-1 flex flex-col items-center pt-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="mb-6" variants={fadeUp}>
            <div className="w-36 h-36 rounded-full bg-card flex items-center justify-center overflow-hidden border-4 border-primary animate-scale-in">
              <img
                src={AVATARES.find((a) => a.id === selecionado)?.img}
                className="w-28 h-28 object-contain transition-all duration-200"
                alt=""
                key={selecionado}
              />
            </div>
          </motion.div>

          <motion.div className="flex-1 w-full rounded-t-3xl bg-card p-6" variants={fadeUp}>
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-8"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              {AVATARES.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setSelecionado(item.id)}
                  className={`w-32 h-32 rounded-2xl flex items-center justify-center border-4 cursor-pointer bg-muted/50 transition-all hover:scale-105 active:scale-95 ${
                    selecionado === item.id ? 'border-accent shadow-lg shadow-accent/20' : 'border-transparent'
                  }`}
                  variants={fadeUp}
                >
                  <img src={item.img} className="w-24 h-24 object-contain" alt="" />
                </motion.button>
              ))}
            </motion.div>

              <Button
                variant="accent" size="lg" className={`w-full max-w-sm mx-auto ${saving ? 'opacity-60' : ''}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <IoReload className="animate-spin" size={20} />
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
          </motion.div>
        </motion.div>
      </PageTransition>
    </Background>
  );
}
