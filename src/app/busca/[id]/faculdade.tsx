import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import { getAllColleges, getCollegeCourses } from '@/services/collegeService';
import { College, CourseImp } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FaculdadeDetailSkeleton from '@/components/skeletons/FaculdadeDetailSkeleton';

const { width } = Dimensions.get('window');

export default function FaculdadeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<CourseImp[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const collegeId = parseInt(id || '0', 10);
    Promise.all([getAllColleges(), getCollegeCourses(collegeId)]).then(
      ([colleges, courseList]) => {
        const found = colleges.find((c) => c.id === collegeId);
        setCollege(found || null);
        setCourses(courseList);
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
          <FaculdadeDetailSkeleton />
        </ScrollView>
      </Background>
    );
  }

  if (!college) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.container}>
          <Text style={styles.emptyText}>Faculdade não encontrada</Text>
        </View>
      </Background>
    );
  }

  const showMapButton = Platform.OS !== 'web' && !!college.locale;

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: college.image }} style={styles.headerImage} />
        <View style={styles.headerBody}>
          <Text style={styles.collegeName}>{college.name}</Text>
          <Text style={styles.collegeDesc}>{college.description}</Text>
        </View>

        {showMapButton && (
          <TouchableOpacity style={styles.mapButton} onPress={() => setMapVisible(true)}>
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver no Mapa</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Cursos oferecidos:</Text>

        {courses.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum curso disponível</Text>
        ) : (
          courses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseCard}
              onPress={() => router.push(`/busca/${course.course?.id || course.id}/curso` as any)}
            >
              <View style={styles.courseBody}>
                <Text style={styles.courseName}>{course.course?.name || 'Curso'}</Text>
                <Text style={styles.courseDesc} numberOfLines={2}>
                  {course.details || course.course?.description || ''}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#010080" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {showMapButton && (
        <MapModal
          visible={mapVisible}
          onClose={() => setMapVisible(false)}
          destination={{
            lat: college.locale.lat,
            lon: college.locale.lon,
            name: college.name,
            collegeName: college.name,
          }}
        />
      )}
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
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 120,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 40,
  },
  headerImage: {
    width: '100%',
    height: 180,
    borderRadius: 25,
    marginBottom: 20,
  },
  headerBody: {
    marginBottom: 20,
  },
  collegeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 8,
  },
  collegeDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  courseBody: {
    flex: 1,
    marginRight: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 4,
  },
  courseDesc: {
    fontSize: 13,
    color: '#666',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010080',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});