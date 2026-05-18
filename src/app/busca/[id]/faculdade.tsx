import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import { getAllColleges, getCollegeCourses } from '@/services/collegeService';
import { College, CourseImp } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { resolveImageUrl } from '@/utils/imageResolver';

const { width } = Dimensions.get('window');

export default function FaculdadeDetailScreen() {
  const { id, highlightCourseId } = useLocalSearchParams<{ id: string; highlightCourseId?: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<CourseImp[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const courseRefs = useRef<Map<number, View>>(new Map());
  const pulseAnimations = useRef<Map<number, Animated.Value>>(new Map());

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

  useEffect(() => {
    if (highlightCourseId && courses.length > 0 && !loading) {
      const courseId = parseInt(highlightCourseId, 10);
      const matchingCourse = courses.find((c) => c.course?.id === courseId);
      if (matchingCourse) {
        setHighlightedId(matchingCourse.id);

        const anim = new Animated.Value(1);
        pulseAnimations.current.set(matchingCourse.id, anim);

        setTimeout(() => {
          const ref = courseRefs.current.get(matchingCourse.id);
          if (ref) {
            ref.measureLayout(
              scrollViewRef.current as any,
              (x, y) => {
                scrollViewRef.current?.scrollTo({ y: y - 60, animated: true });
              },
              () => {}
            );
          }
        }, 100);

        Animated.sequence([
          Animated.timing(anim, { toValue: 1.04, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1.04, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1.04, duration: 300, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start(() => {
          setTimeout(() => setHighlightedId(null), 500);
        });
      }
    }
  }, [highlightCourseId, courses, loading]);

  const getCourseStyle = (courseId: number) => {
    const anim = pulseAnimations.current.get(courseId);
    if (anim && highlightedId === courseId) {
      return {
        transform: [{ scale: anim }],
        borderColor: '#FFD700',
        borderWidth: 3,
        shadowColor: '#FFD700',
        shadowOpacity: 0.6,
        shadowRadius: 12,
      };
    }
    return {};
  };

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
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {resolveImageUrl(college.image) ? <Image source={{ uri: resolveImageUrl(college.image) }} style={styles.headerImage} /> : null}
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
            <Animated.View
              key={course.id}
              style={getCourseStyle(course.id)}
              ref={(ref) => {
                if (ref) courseRefs.current.set(course.id, ref);
              }}
            >
              <TouchableOpacity
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
            </Animated.View>
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
