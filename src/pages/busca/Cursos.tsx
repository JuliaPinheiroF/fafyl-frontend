import Background from '@/components/layout/background';
import { IoSearch, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/types';
import { getAllCourses } from '@/services/courseService';
import CursosSkeleton from '@/components/skeletons/CursosSkeleton';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import PageTransition from '@/components/layout/PageTransition';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function CursosScreen() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCourses().then((data) => {
      setCourses(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(courses);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        courses.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, courses]);

  return (
    <Background title="Cursos" showBackButton onBackPress={() => navigate('/busca')}>
      <PageTransition>
        <div className="flex-1 p-4">
          <motion.div
            className="relative mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <IoSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10 rounded-2xl"
              placeholder="Buscar curso..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          {loading ? (
            <CursosSkeleton />
          ) : filtered.length === 0 ? (
            <motion.p
              className="text-center text-sm text-muted-foreground mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Nenhum curso encontrado
            </motion.p>
          ) : (
            <motion.div
              className="space-y-3 pb-24"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card
                    className="p-4 cursor-pointer"
                    onClick={() => navigate(`/busca/${item.id}/curso`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-primary truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      <div className="shrink-0 group-hover:translate-x-1 transition-transform">
                        <IoChevronForward size={20} className="text-primary shrink-0" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </PageTransition>
    </Background>
  );
}
