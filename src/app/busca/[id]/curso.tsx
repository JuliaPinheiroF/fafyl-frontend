import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import FilterBar from '@/components/filter/FilterBar';
import CursoDetailSkeleton from '@/components/skeletons/CursoDetailSkeleton';
import { getCourseById } from '@/services/courseService';
import { getCollegesWithCourse } from '@/services/fafylService';
import { Course, College, CourseImp } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useLocationAndRoute from '@/hooks/useLocationAndRoute';
import { calculateHaversineDistance, formatDistanceCompact } from '@/utils/distance';

const { width } = Dimensions.get('window');

const PERIOD_LABELS: Record<string, string> = {
  matutino: 'Matutino',
  vespertino: 'Vespertino',
  noturno: 'Noturno',
  integral: 'Integral',
};

function renderStars(value: number | null | undefined) {
  if (value == null) {
    return <Text style={styles.starDash}>—</Text>;
  }
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= value ? 'star' : 'star-outline'}
        size={14}
        color={i <= value ? '#FFC107' : '#9E9E9E'}
      />
    );
  }
  return (
    <View style={styles.starsRow}>
      {stars}
      <Text style={styles.starValue}>{value}/5</Text>
    </View>
  );
}

export default function CursoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [items, setItems] = useState<{ college: College; courseImp: CourseImp }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [selectedImp, setSelectedImp] = useState<CourseImp | null>(null);
  const [maxDistance, setMaxDistance] = useState(0);

  const { currentLocation, getCurrentLocation } = useLocationAndRoute();

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const courseId = parseInt(id || '0', 10);
    Promise.all([getCourseById(courseId), getCollegesWithCourse(courseId)]).then(
      ([found, results]) => {
        setCourse(found);
        setItems(results);
        setLoading(false);
      }
    );
  }, [id]);

  const distanceOf = (item: { college: College; courseImp: CourseImp }): number | null => {
    const loc = item.courseImp.locale ?? item.college.locale;
    if (!loc || !currentLocation) return null;
    return calculateHaversineDistance(
      currentLocation.lat,
      currentLocation.lon,
      loc.lat,
      loc.lon
    );
  };

  const displayItems = maxDistance > 0 && currentLocation
    ? items.filter((item) => {
        const dist = distanceOf(item);
        return dist !== null && dist <= maxDistance;
      })
    : items;

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

        <FilterBar
          showDistance
          maxDistance={maxDistance || undefined}
          onMaxDistanceChange={(v) => setMaxDistance(v)}
        />

        {maxDistance > 0 && !currentLocation && (
          <Text style={styles.hintText}>
            Permita acesso à localização para filtrar por distância
          </Text>
        )}

        {displayItems.length === 0 ? (
          <Text style={styles.emptyText}>
            {maxDistance > 0 && !currentLocation
              ? 'Permita acesso à localização para filtrar por distância'
              : 'Nenhuma faculdade com esse curso'}
          </Text>
        ) : (
          displayItems.map(({ college, courseImp }) => (
            <CourseImpCard
              key={courseImp.id}
              imp={{ ...courseImp, college }}
              isMobile={isMobile}
              onViewMap={handleViewMap}
              distance={distanceOf({ college, courseImp })}
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
  distance?: number | null;
}

function CourseImpCard({ imp, isMobile, onViewMap, distance }: CourseImpCardProps) {
  const [expanded, setExpanded] = useState(false);

  const collegeName = imp.college?.name || 'Faculdade';

  const feesLabel =
    imp.fees === 0
      ? { text: 'Pública', isPublic: true }
      : imp.fees
        ? { text: `R$ ${imp.fees.toFixed(2).replace('.', ',')}/mês`, isPublic: false }
        : null;

  const hasLink =
    imp.note && typeof imp.note.link === 'string' && imp.note.link.length > 0;

  const noteEntries: {
    id: string;
    icon: string;
    label: string;
    content: React.ReactNode;
  }[] = [];

  if (imp.note) {
    if ('mec' in imp.note) {
      noteEntries.push({
        id: 'mec',
        icon: 'star',
        label: 'Conceito MEC',
        content: renderStars(imp.note.mec as number | null),
      });
    }
    if ('enade' in imp.note) {
      noteEntries.push({
        id: 'enade',
        icon: 'star',
        label: 'Conceito ENADE',
        content: renderStars(imp.note.enade as number | null),
      });
    }
    if ('horario' in imp.note && imp.note.horario) {
      noteEntries.push({
        id: 'horario',
        icon: 'time-outline',
        label: 'Período',
        content: (
          <Text style={styles.detailValue}>{PERIOD_LABELS[imp.note.horario as string] || (imp.note.horario as string)}</Text>
        ),
      });
    }
    if ('duracao_semestres' in imp.note && imp.note.duracao_semestres) {
      const sem = imp.note.duracao_semestres as number;
      noteEntries.push({
        id: 'duracao',
        icon: 'calendar-outline',
        label: 'Duração',
        content: (
          <Text style={styles.detailValue}>{sem} semestres ({Math.round(sem / 2)} anos)</Text>
        ),
      });
    }
  }

  return (
    <TouchableOpacity
      style={styles.impCard}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.impHeader}>
        <View style={styles.impInfo}>
          <Text style={styles.impCollege}>{collegeName}</Text>
          {feesLabel && (
            <Text style={feesLabel.isPublic ? styles.impFeesPublic : styles.impFees}>
              {feesLabel.text}
            </Text>
          )}
          {distance != null && (
            <Text style={styles.impDistance}>
              {formatDistanceCompact(distance)} de distância
            </Text>
          )}
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

          {noteEntries.length > 0 && (
            <View style={styles.notesList}>
              {noteEntries.map((entry) => (
                <View key={entry.id} style={styles.detailRow}>
                  <Ionicons
                    name={entry.icon as any}
                    size={14}
                    color={entry.id === 'mec' || entry.id === 'enade' ? '#FFC107' : '#010080'}
                  />
                  <Text style={styles.detailLabel}>{entry.label}:</Text>
                  {entry.content}
                </View>
              ))}
            </View>
          )}

          {(hasLink || (isMobile && imp.locale)) && (
            <View style={styles.actionsRow}>
              {hasLink && (
                <TouchableOpacity
                  style={styles.outlineButton}
                  onPress={() => Linking.openURL(imp.note.link as string)}
                >
                  <Ionicons name="open-outline" size={16} color="#010080" />
                  <Text style={styles.outlineButtonText}>Ver no site</Text>
                </TouchableOpacity>
              )}

              {isMobile && imp.locale && (
                <TouchableOpacity
                  style={[styles.outlineButton, hasLink && styles.actionsFlex]}
                  onPress={() => onViewMap(imp)}
                >
                  <Ionicons name="map" size={16} color="#010080" />
                  <Text style={styles.outlineButtonText}>Mapa</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
  hintText: {
    fontSize: 13,
    color: '#666',
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
  impDistance: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  impFees: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  impFeesPublic: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
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
  notesList: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 6,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starValue: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  starDash: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#010080',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  actionsFlex: {
    flex: 1,
  },
  outlineButtonText: {
    color: '#010080',
    fontSize: 14,
    fontWeight: '600',
  },
});