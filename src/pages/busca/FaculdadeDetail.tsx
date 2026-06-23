import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import { getAllColleges, getCollegeCourses } from '@/services/collegeService';
import { College, CourseImp } from '@/types';
import { IoChevronForward, IoMap, IoLocate } from 'react-icons/io5';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import FaculdadeDetailSkeleton from '@/components/skeletons/FaculdadeDetailSkeleton';
import { resolveImageUrl } from '@/utils/imageResolver';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';
import { getCachedLocation, setCachedLocation } from '@/utils/locationCache';
import { calculateHaversineDistance, formatDistanceCompact } from '@/utils/distance';
import { USE_MOCKS } from '@/config/env';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function FaculdadeDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const highlightCourseId = searchParams.get('highlightCourseId');
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<CourseImp[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [pulseStep, setPulseStep] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

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
        setTimeout(() => {
          const element = document.getElementById(`course-${matchingCourse.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        let step = 0;
        const interval = setInterval(() => {
          step++;
          setPulseStep(step);
          if (step >= 6) {
            clearInterval(interval);
            setTimeout(() => {
              setHighlightedId(null);
              setPulseStep(0);
            }, 500);
          }
        }, 300);
      }
    }
  }, [highlightCourseId, courses, loading]);

  useEffect(() => {
    const cached = getCachedLocation();
    if (cached) {
      setUserLocation(cached);
      return;
    }

    if (USE_MOCKS) {
      const mockLoc = { lat: -23.5505, lon: -46.6333 };
      setUserLocation(mockLoc);
      setCachedLocation(mockLoc.lat, mockLoc.lon);
      return;
    }

    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(loc);
        setCachedLocation(loc.lat, loc.lon);
        setLocationLoading(false);
      },
      () => {
        setLocationError(true);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const distance: number | null =
    userLocation && college?.locale
      ? calculateHaversineDistance(
          userLocation.lat,
          userLocation.lon,
          college.locale.lat,
          college.locale.lon
        )
      : null;

  const isHighlighted = (courseId: number) => highlightedId === courseId;

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1"><FaculdadeDetailSkeleton /></div>
        </PageTransition>
      </Background>
    );
  }

  if (!college) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Faculdade não encontrada</p>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton>
      <PageTransition>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {resolveImageUrl(college.image) && (
              <motion.div
                className="h-44 rounded-2xl overflow-hidden mb-5"
                variants={fadeUp}
              >
                <img
                  src={resolveImageUrl(college.image)}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  alt=""
                />
              </motion.div>
            )}

            <motion.div className="mb-5" variants={fadeUp}>
              <h1 className="text-2xl font-bold text-primary mb-2">{college.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{college.description}</p>
            </motion.div>

            {college.locale && (
              <motion.div variants={fadeUp} className="space-y-3 mb-5">
                {distance !== null ? (
                  <div className="flex items-center gap-2 bg-accent/30 rounded-xl px-4 py-3">
                    <IoLocate size={18} className="text-primary shrink-0" />
                    <span className="text-sm text-foreground">
                      <strong className="text-primary">{formatDistanceCompact(distance)}</strong> de distância
                    </span>
                  </div>
                ) : locationLoading ? (
                  <div className="flex items-center gap-2 bg-accent/30 rounded-xl px-4 py-3">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Obtendo distância...</span>
                  </div>
                ) : locationError ? (
                  <div className="flex items-center gap-2 bg-accent/30 rounded-xl px-4 py-3">
                    <IoLocate size={18} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Permita acesso à localização para ver a distância
                    </span>
                  </div>
                ) : null}

                <Button size="lg" className="w-full gap-2" onClick={() => setMapVisible(true)}>
                  <IoMap size={18} />
                  Ver no Mapa
                </Button>
              </motion.div>
            )}

            <motion.h2 className="text-lg font-semibold text-foreground mb-4" variants={fadeUp}>
              Cursos oferecidos:
            </motion.h2>

            {courses.length === 0 ? (
              <motion.p
                className="text-center text-sm text-muted-foreground mt-10"
                variants={fadeUp}
              >
                Nenhum curso disponível
              </motion.p>
            ) : (
              <motion.div className="space-y-3 pb-24" variants={fadeUp}>
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    id={`course-${course.id}`}
                    animate={isHighlighted(course.id) ? {
                      scale: pulseStep % 2 === 1 ? 1.04 : 1,
                      borderColor: '#FFD700',
                      borderWidth: 3,
                      boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
                    } : {
                      scale: 1,
                      borderColor: 'transparent',
                      borderWidth: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className="flex items-center bg-card rounded-2xl p-4 w-full text-left cursor-pointer border-none shadow-sm active:scale-[0.99] transition-transform"
                      onClick={() => navigate(`/busca/${course.course?.id || course.id}/curso`)}
                    >
                      <div className="flex-1 min-w-0 mr-2.5">
                        <p className="text-base font-semibold text-primary mb-1 truncate">{course.course?.name || 'Curso'}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.details || course.course?.description || ''}</p>
                      </div>
                      <div className="shrink-0 group-hover:translate-x-1 transition-transform">
                        <IoChevronForward size={20} className="text-primary shrink-0" />
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {college.locale && (
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
      </PageTransition>
    </Background>
  );
}
