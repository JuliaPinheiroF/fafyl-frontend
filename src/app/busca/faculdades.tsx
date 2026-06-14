import Background from '@/components/layout/background';
import { IoSearch, IoFilter } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { College } from '@/types';
import { getAllColleges, getCollegeCourses } from '@/services/collegeService';
import FaculdadesSkeleton from '@/components/skeletons/FaculdadesSkeleton';
import { resolveImageUrl } from '@/utils/imageResolver';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/layout/PageTransition';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function FaculdadesScreen() {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filtered, setFiltered] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllColleges().then(async (data) => {
      let filteredColleges = data;
      if (courseId) {
        const id = parseInt(courseId, 10);
        const withCourse: College[] = [];
        for (const college of data) {
          const imps = await getCollegeCourses(college.id);
          if (imps.some((imp) => imp.course.id === id)) {
            withCourse.push(college);
          }
        }
        filteredColleges = withCourse;
      }
      setColleges(filteredColleges);
      setFiltered(filteredColleges);
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(colleges);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        colleges.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, colleges]);

  const renderCard = (item: College) => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card className="overflow-hidden border-0">
        {resolveImageUrl(item.image) && (
          <div className="h-40 overflow-hidden">
            <img
              src={resolveImageUrl(item.image)}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              alt={item.name}
            />
          </div>
        )}
        <CardContent className="p-5 bg-primary">
          <h3 className="text-lg font-bold text-accent mb-2">{item.name}</h3>
          <p className="text-sm text-primary-foreground/80 mb-4 line-clamp-3">{item.description}</p>
            <Button
              variant="accent" size="lg" className="w-full"
              onClick={() => {
                let url = `/busca/${item.id}/faculdade`;
                if (courseId) url += `?highlightCourseId=${courseId}`;
                navigate(url);
              }}
            >
              Lista de cursos
            </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Background title="Faculdades" showBackButton onBackPress={() => navigate('/busca')}>
      <PageTransition>
        <div className="flex-1 p-4">
          {courseId && (
            <motion.div
              className="flex items-center bg-primary/5 rounded-xl p-3 mb-3 gap-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <IoFilter size={16} className="text-primary shrink-0" />
              <span className="text-xs text-primary font-semibold flex-1">
                Mostrando faculdades com o curso selecionado
              </span>
              <button
                onClick={() => { setFiltered(colleges); setSearch(''); }}
                className="text-xs text-primary font-bold underline cursor-pointer bg-transparent border-none shrink-0"
              >
                Limpar
              </button>
            </motion.div>
          )}

          <motion.div
            className="relative mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 rounded-2xl"
              placeholder="Buscar faculdade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          {loading ? (
            <FaculdadesSkeleton />
          ) : filtered.length === 0 ? (
            <motion.p
              className="text-center text-sm text-muted-foreground mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Nenhuma faculdade encontrada
            </motion.p>
          ) : (
            <motion.div
              className="space-y-4 pb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((item) => renderCard(item))}
            </motion.div>
          )}
        </div>
      </PageTransition>
    </Background>
  );
}
