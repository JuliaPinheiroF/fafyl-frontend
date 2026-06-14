import Background from '@/components/layout/background';
import MapModal from '@/components/MapModal';
import CursoDetailSkeleton from '@/components/skeletons/CursoDetailSkeleton';
import { getAllCourses } from '@/services/courseService';
import { getCollegesWithCourse } from '@/services/fafylService';
import { Course, College, CourseImp } from '@/types';
import { IoChevronUp, IoChevronDown, IoMap } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function CursoDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1"><CursoDetailSkeleton /></div>
        </PageTransition>
      </Background>
    );
  }

  if (!course) {
    return (
      <Background title="FAFYL" showBackButton>
        <PageTransition>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Curso não encontrado</p>
          </div>
        </PageTransition>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton>
      <PageTransition>
        <div className="flex-1 overflow-y-auto p-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6" variants={fadeUp}>
              <h1 className="text-2xl font-bold text-primary mb-1.5">{course.name}</h1>
              <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
            </motion.div>

            <motion.h2 className="text-base font-semibold text-foreground mb-3" variants={fadeUp}>
              Faculdades com {course.name}:
            </motion.h2>

            {items.length === 0 ? (
              <motion.p className="text-center text-sm text-muted-foreground mt-10" variants={fadeUp}>
                Nenhuma faculdade com esse curso
              </motion.p>
            ) : (
              <motion.div className="space-y-3 pb-24" variants={fadeUp}>
                {items.map(({ college, courseImp }, index) => (
                  <motion.div key={courseImp.id} variants={fadeUp} custom={index}>
                    <CourseImpCard
                      imp={{ ...courseImp, college }}
                      onViewMap={handleViewMap}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {selectedImp?.locale && (
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
      </PageTransition>
    </Background>
  );
}

interface CourseImpCardProps {
  imp: CourseImp;
  onViewMap: (imp: CourseImp) => void;
}

function CourseImpCard({ imp, onViewMap }: CourseImpCardProps) {
  const [expanded, setExpanded] = useState(false);
  const collegeName = imp.college?.name || 'Faculdade';

  return (
    <div>
      <Card className="rounded-2xl overflow-hidden">
        <button
          className="w-full text-left p-4 cursor-pointer border-none bg-transparent active:scale-[0.99] transition-transform"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-primary mb-0.5 truncate">{collegeName}</p>
              <p className="text-sm font-medium text-muted-foreground">
                {imp.fees ? `R$ ${imp.fees.toFixed(2).replace('.', ',')}` : 'Preço não disponível'}
              </p>
            </div>
            <div className="transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <IoChevronDown size={20} className="text-primary shrink-0" />
            </div>
          </div>
        </button>

        <div
          className="overflow-hidden transition-all duration-250 ease-out"
          style={{
            height: expanded ? 'auto' : 0,
            opacity: expanded ? 1 : 0,
          }}
        >
          <CardContent className="pt-0 pb-4 px-4">
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2.5">{imp.details || ''}</p>

              {imp.locale && (
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold text-foreground">Localização:</span>{' '}
                  Lat {imp.locale.lat?.toFixed(4) || '0'} | Lon {imp.locale.lon?.toFixed(4) || '0'}
                </p>
              )}

                {imp.locale && (
                  <Button
                    variant="outline" size="lg" className="w-full gap-1.5"
                    onClick={(e) => { e.stopPropagation(); onViewMap(imp); }}
                  >
                    <IoMap size={16} />
                    Ver no Mapa
                  </Button>
                )}

              {imp.note && Object.entries(imp.note).map(([key, value]) => (
                <p key={key} className="text-xs text-muted-foreground mt-1">
                  <span className="font-semibold text-foreground">{key}:</span>{' '}
                  {String(value)}
                </p>
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
