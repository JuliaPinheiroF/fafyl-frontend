import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Course, CourseImp } from '@/types';
import { getAllCourses, getCourseImpsByCourseId } from '@/services/courseService';
import CursoDetailSkeleton from '@/components/skeletons/CursoDetailSkeleton';

const { width } = Dimensions.get('window');

export default function CursoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [imps, setImps] = useState<CourseImp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const courseId = parseInt(id || '0', 10);
    Promise.all([getAllCourses(), getCourseImpsByCourseId(courseId)]).then(
      ([courses, courseImps]) => {
        const found = courses.find((c) => c.id === courseId);
        setCourse(found || null);
        setImps(courseImps);
        setLoading(false);
      }
    );
  }, [id]);

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CursoDetailSkeleton />
        </ScrollView>
      </Background>
    );
  }

  if (!course) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.container}>
          <Text style={styles.emptyText}>Curso não encontrado</Text>
        </View>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseDesc}>{course.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.tagsRow}>
            {(course.abilities || []).map((ability) => (
              <View key={ability} style={styles.tag}>
                <Text style={styles.tagText}>{ability}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Não pode ser</Text>
          <View style={styles.tagsRow}>
            {(course.cantBe || []).map((item) => (
              <View key={item} style={styles.tagRed}>
                <Text style={styles.tagTextRed}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cursos implementados:</Text>

        {imps.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma implementação disponível</Text>
        ) : (
          imps.map((imp) => (
            <CourseImpCard key={imp.id} imp={imp} />
          ))
        )}
      </ScrollView>
    </Background>
  );
}

function CourseImpCard({ imp }: { imp: CourseImp }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.impCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.impHeader}>
        <View style={styles.impInfo}>
          <Text style={styles.impCollege}>{imp.college?.name || imp.course?.name || 'Faculdade'}</Text>
          <Text style={styles.impFees}>
            {imp.fees ? `R$ ${imp.fees.toFixed(2).replace('.', ',')}` : 'Preço não disponível'}
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#010080"
        />
      </View>

      {expanded && (
        <View style={styles.impDetails}>
          <Text style={styles.impDetailsText}>{imp.details || ''}</Text>

          {imp.locale && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Localização:</Text>
              <Text style={styles.detailValue}>
                Lat {imp.locale.lat?.toFixed(4) || '0'} | Lon {imp.locale.lon?.toFixed(4) || '0'}
              </Text>
            </View>
          )}

          {imp.note && Object.entries(imp.note).map(([key, value]) => (
            <View key={key} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{key}:</Text>
              <Text style={styles.detailValue}>{String(value)}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 120,
  },
  loader: { marginTop: 60 },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 6,
  },
  courseDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#010080',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 13,
    color: '#FFD700',
    fontWeight: '600',
  },
  tagRed: {
    backgroundColor: '#FF4444',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagTextRed: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  impCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  impHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impInfo: {
    flex: 1,
  },
  impCollege: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 2,
  },
  impFees: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  impDetails: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  impDetailsText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 6,
  },
  detailValue: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
});