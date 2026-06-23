import Background from '@/components/layout/background';
import { IoSchool, IoRefresh } from 'react-icons/io5';
import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Fafyl } from '@/types';
import { getRecommendations } from '@/services/fafylService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ResultadoScreen() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const profile = searchParams.get('profile');
  const [results, setResults] = useState<Fafyl[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(1);

  useEffect(() => {
    if (!profile) {
      navigate('/quiz', { replace: true });
      return;
    }

    const discProfile = JSON.parse(profile);
    getRecommendations(discProfile).then((data) => {
      setResults(data);
      if (data.length > 0) {
        setMaxScore(data[0].score);
      }
      setLoading(false);
    });
  }, [profile, navigate]);

  const getPercentage = (score: number): number => {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  };

  const handleViewColleges = (courseId: number) => {
    navigate('/busca/faculdades?courseId=' + courseId);
  };

  const handleRetake = () => {
    navigate('/quiz', { replace: true });
  };

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-muted-foreground animate-pulse">
                Calculando compatibilidade...
              </span>
            </div>
          </div>
        </PageTransition>
      </Background>
    );
  }

  if (results.length === 0) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <img
              src="/images/triste.png"
              alt=""
              className="w-24 h-24 mb-5 animate-scale-in"
            />
            <motion.h2
              className="text-xl font-bold text-primary mb-2"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Nenhum curso compatível
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground mb-8 max-w-sm"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Não encontramos cursos compatíveis com seu perfil. Tente refazer o quiz.
            </motion.p>
            <Button variant="accent" onClick={handleRetake}>
              Refazer quiz
            </Button>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton>
      <PageTransition>
        <div className="flex-1 overflow-y-auto">
          <motion.div
            className="flex flex-col items-center px-4 pt-6 pb-4 text-center"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.img
              src="/images/muitofeliz.png"
              alt=""
              className="w-16 h-16 mb-3"
              variants={fadeUp}
            />
            <motion.h2 className="text-xl font-bold text-primary mb-1" variants={fadeUp}>
              Seus cursos recomendados!
            </motion.h2>
            <motion.p className="text-sm text-muted-foreground" variants={fadeUp}>
              Com base no seu perfil DISC, encontramos {results.length} curso{results.length > 1 ? 's' : ''} compatívei{results.length > 1 ? 's' : 'l'}.
            </motion.p>
          </motion.div>

          <motion.div
            className="px-4 pb-24 space-y-3"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {results.map((item) => {
              const percentage = getPercentage(item.score);
              return (
                <motion.div key={item.course.id} variants={fadeUp}>
                  <Card className="rounded-2xl overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-base font-semibold text-primary flex-1 mr-2">{item.course.name}</h3>
                        <div className="gold-gradient rounded-xl px-3 py-1 shrink-0 animate-scale-in shadow-[var(--shadow-glow-gold)]">
                          <span className="text-sm font-bold text-accent-foreground">{percentage}%</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
                        {item.course.description}
                      </p>

                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                        />
                      </div>

                        <Button
                          variant="accent" size="lg" className="w-full gap-2"
                          onClick={() => handleViewColleges(item.course.id)}
                        >
                          <IoSchool size={16} />
                          Ver faculdades
                        </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            <Button
              variant="outline" size="lg" className="w-full gap-2 mt-4"
              onClick={handleRetake}
            >
              <IoRefresh size={16} />
              Refazer quiz
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    </Background>
  );
}
