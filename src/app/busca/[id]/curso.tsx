import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import CursoDetailSkeleton from '@/components/skeletons/CursoDetailSkeleton';
import { getAllCourses } from '@/services/courseService';
import { getCollegesWithCourse } from '@/services/fafylService';
import { Course, College, CourseImp } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function CursoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<{ college: College; courseImp: CourseImp }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedImp, setSelectedImp] = useState<CourseImp | null>(null);

  useEffect(() => {
    const courseId = parseInt(id || '0', 10);
    Promise.all([getAllCourses(), getCollegesWithCourse(courseId)]).then(
      ([courses, results]) => {
        const found = courses.find((c) => c.id === courseId);
        setCourse(found || null);
        setItems(results);
        setLoading(false);
      }
    );
  }, [id]);

  const handleViewMap = (imp: CourseImp) => {
    setSelectedImp(imp);
    setMapVisible(true);
  };

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

  const isMobile = Platform.OS !== 'web';

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

        <Text style={styles.sectionTitle}>Faculdades com {course.name}:</Text>

        {items.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma faculdade com esse curso</Text>
        ) : (
          items.map(({ college, courseImp }) => (
            <CourseImpCard 
              key={courseImp.id} 
              imp={{ ...courseImp, college }}
              isMobile={isMobile} 
              onViewMap={handleViewMap} 
            />
          ))
        )}
      </ScrollView>

      {isMobile && selectedImp?.locale && (
        <MapModal
          visible={mapVisible}
          onClose={() => {
            setMapVisible(false);
            setSelectedImp(null);
          }}
          destination={{
            lat: selectedImp.locale.lat,
            lon: selectedImp.locale.lon,
            name: selectedImp.name,
            collegeName: selectedImp.college?.name || '',
          }}
        />
      )}
    </Background>
  );
}

interface CourseImpCardProps {
  imp: CourseImp;
  isMobile: boolean;
  onViewMap: (imp: CourseImp) => void;
}

function CourseImpCard({ imp, isMobile, onViewMap }: CourseImpCardProps) {
  const [expanded, setExpanded] = useState(false);

  const collegeName = imp.college?.name || 'Faculdade';

  return (
    <TouchableOpacity
      style={styles.impCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.impHeader}>
        <View style={styles.impInfo}>
          <Text style={styles.impCollege}>{collegeName}</Text>
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

          {isMobile && imp.locale && (
            <TouchableOpacity style={styles.mapButton} onPress={() => onViewMap(imp)}>
              <Ionicons name="map" size={18} color="#fff" />
              <Text style={styles.mapButtonText}>Ver no Mapa</Text>
            </TouchableOpacity>
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010080',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 6,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});