import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Fafyl } from '@/types';
import { getRecommendations } from '@/services/fafylService';

const { width } = Dimensions.get('window');

export default function ResultadoScreen() {
  const { profile } = useLocalSearchParams<{ profile: string }>();
  const [results, setResults] = useState<Fafyl[]>([]);
  const [loading, setLoading] = useState(true);
  const [maxScore, setMaxScore] = useState(1);

  useEffect(() => {
    if (!profile) {
      router.replace('/quiz' as any);
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
  }, [profile]);

  const getPercentage = (score: number): number => {
    if (maxScore === 0) return 0;
    return Math.round((score / maxScore) * 100);
  };

  const handleViewColleges = (courseId: number) => {
    router.push({
      pathname: '/busca/faculdades',
      params: { courseId: courseId.toString() },
    } as any);
  };

  const handleRetake = () => {
    router.replace('/quiz' as any);
  };

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Calculando compatibilidade...</Text>
        </View>
      </Background>
    );
  }

  if (results.length === 0) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../assets/images/triste.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>Nenhum curso compatível</Text>
          <Text style={styles.emptyText}>
            Não encontramos cursos compatíveis com seu perfil. Tente refazer o quiz.
          </Text>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeButtonText}>Refazer quiz</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/muitofeliz.png')}
            style={styles.headerImage}
          />
          <Text style={styles.headerTitle}>Seus cursos recomendados!</Text>
          <Text style={styles.headerSubtitle}>
            Com base no seu perfil DISC, encontramos {results.length} curso{results.length > 1 ? 's' : ''} compatívei{results.length > 1 ? 's' : 'l'}.
          </Text>
        </View>

        <FlatList
          data={results}
          keyExtractor={(item) => item.course.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const percentage = getPercentage(item.score);
            return (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultName}>{item.course.name}</Text>
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>{percentage}%</Text>
                  </View>
                </View>

                <Text style={styles.resultDesc} numberOfLines={2}>
                  {item.course.description}
                </Text>

                {/* Score bar */}
                <View style={styles.scoreTrack}>
                  <View
                    style={[
                      styles.scoreFill,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>

                <TouchableOpacity
                  style={styles.collegesButton}
                  onPress={() => handleViewColleges(item.course.id)}
                >
                  <Ionicons name="school" size={18} color="#010080" />
                  <Text style={styles.collegesButtonText}>Ver faculdades</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          ListFooterComponent={
            <TouchableOpacity style={styles.retakeButtonFooter} onPress={handleRetake}>
              <Ionicons name="refresh" size={18} color="#010080" />
              <Text style={styles.retakeButtonFooterText}>Refazer quiz</Text>
            </TouchableOpacity>
          }
        />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  retakeButton: {
    backgroundColor: '#FFDE59',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerImage: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#010080',
    flex: 1,
    marginRight: 10,
  },
  percentageBadge: {
    backgroundColor: '#010080',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  resultDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  scoreTrack: {
    height: 6,
    backgroundColor: '#EEE',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 14,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  collegesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDE59',
    borderRadius: 20,
    paddingVertical: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  collegesButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#010080',
  },
  retakeButtonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#010080',
  },
  retakeButtonFooterText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#010080',
  },
});
