import Background from '@/components/layout/background';
import { IoChevronBack, IoChevronForward, IoStar } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/types';
import { getQuestions, computeDiscProfile } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PageTransition from '@/components/layout/PageTransition';

const questionVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.2 } },
};

const altVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.05 * i, duration: 0.25 },
  }),
};

export default function QuizScreen() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    getQuestions().then((data) => {
      setQuestions(data);
      setLoading(false);
    });
  }, []);

  const handleSelect = (altId: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questions[currentIndex].id, altId);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else {
      const profile = computeDiscProfile(answers, questions);
      const profileStr = JSON.stringify(profile);
      navigate('/quiz/resultado?profile=' + encodeURIComponent(profileStr));
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    } else {
      navigate(-1);
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;
  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  const currentQuestion = questions[currentIndex];
  const selectedAltId = answers.get(currentQuestion?.id);

  if (loading || questions.length === 0) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex justify-center items-center">
            <span className="text-muted-foreground animate-pulse">
              Carregando perguntas...
            </span>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton onBackPress={handleBack}>
      <PageTransition>
        <div className="flex-1 flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-xs text-muted-foreground text-center block mt-2">
              Pergunta {currentIndex + 1} de {questions.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion.id}
                custom={direction}
                variants={questionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <Card className="p-5 rounded-2xl">
                  <h2 className="text-lg font-semibold text-primary leading-relaxed">{currentQuestion.text}</h2>
                </Card>

                <div className="space-y-3">
                  {currentQuestion.alternatives.map((alt, i) => {
                    const isSelected = selectedAltId === alt.id;
                    return (
                      <button
                        key={alt.id}
                        className={`w-full text-left bg-card rounded-xl p-4 flex items-center gap-3 cursor-pointer border-2 transition-all active:scale-[0.98] ${
                          isSelected ? 'border-accent bg-accent/5' : 'border-transparent hover:border-primary/20'
                        }`}
                        onClick={() => handleSelect(alt.id)}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-primary' : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-accent animate-scale-in" />}
                        </div>
                        <span className={`text-sm flex-1 ${isSelected ? 'font-semibold text-primary' : 'text-foreground'}`}>
                          {alt.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            {!isFirstQuestion && (
              <Button variant="ghost" className="gap-1.5" onClick={handleBack}>
                <IoChevronBack size={18} />
                Voltar
              </Button>
            )}
            {isFirstQuestion && <div />}
            <Button
              variant="accent"
              className="gap-2"
              onClick={handleNext}
              disabled={!selectedAltId}
            >
              <span>{isLastQuestion ? 'Ver resultado' : 'Próxima'}</span>
              {isLastQuestion ? <IoStar size={18} /> : <IoChevronForward size={18} />}
            </Button>
          </div>
        </div>
      </PageTransition>
    </Background>
  );
}
