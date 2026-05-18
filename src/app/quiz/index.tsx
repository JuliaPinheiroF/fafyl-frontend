import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Question } from '@/types';
import { getQuestions, computeDiscProfile } from '@/services/quizService';

const { width } = Dimensions.get('window');

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);

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
      setCurrentIndex(currentIndex + 1);
    } else {
      const profile = computeDiscProfile(answers, questions);
      const profileStr = JSON.stringify(profile);
      router.push({
        pathname: '/quiz/resultado',
        params: { profile: profileStr },
      } as any);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      router.back();
    }
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const isFirstQuestion = currentIndex === 0;
  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;
  const currentQuestion = questions[currentIndex];
  const selectedAltId = answers.get(currentQuestion?.id);

  if (loading || questions.length === 0) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perguntas...</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton onBackPress={handleBack}>
      <View style={styles.container}>
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Pergunta {currentIndex + 1} de {questions.length}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Question card */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.text}</Text>
          </View>

          {/* Alternatives */}
          <View style={styles.alternativesContainer}>
            {currentQuestion.alternatives.map((alt) => {
              const isSelected = selectedAltId === alt.id;
              return (
                <TouchableOpacity
                  key={alt.id}
                  style={[
                    styles.alternativeCard,
                    isSelected && styles.alternativeSelected,
                  ]}
                  onPress={() => handleSelect(alt.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text
                    style={[
                      styles.alternativeText,
                      isSelected && styles.alternativeTextSelected,
                    ]}
                  >
                    {alt.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Navigation buttons */}
        <View style={styles.buttonRow}>
          {!isFirstQuestion && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={20} color="#010080" />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedAltId && styles.nextButtonDisabled,
            ]}
            onPress={handleNext}
            disabled={!selectedAltId}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Ver resultado' : 'Próxima'}
            </Text>
            <Ionicons
              name={isLastQuestion ? 'star' : 'chevron-forward'}
              size={20}
              color="#010080"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: width,
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#DDD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#010080',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010080',
    lineHeight: 26,
  },
  alternativesContainer: {
    gap: 12,
  },
  alternativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  alternativeSelected: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: '#FFFDE7',
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioCircleSelected: {
    borderColor: '#010080',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  alternativeText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  alternativeTextSelected: {
    fontWeight: '600',
    color: '#010080',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: '#010080',
    fontWeight: '600',
    marginLeft: 6,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFDE59',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
    marginRight: 8,
  },
});
