import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Register from '@/app/index';
import Login from '@/app/login';
import Home from '@/app/(tabs)/home';
import QuizInfo from '@/app/(tabs)/quiz-info';
import Busca from '@/app/(tabs)/busca';
import Sobre from '@/app/(tabs)/sobre';
import Faculdades from '@/app/busca/faculdades';
import Cursos from '@/app/busca/cursos';
import Chatbot from '@/app/busca/chatbot';
import CursoDetail from '@/app/busca/[id]/curso';
import FaculdadeDetail from '@/app/busca/[id]/faculdade';
import Quiz from '@/app/quiz/index';
import Resultado from '@/app/quiz/resultado';
import Profile from '@/app/profile/index';
import Capelinhos from '@/app/profile/capelinhos';
import Historico from '@/app/profile/historico';
import Editar from '@/app/profile/editar';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/resultado" element={<Resultado />} />
        <Route path="/busca/faculdades" element={<Faculdades />} />
        <Route path="/busca/cursos" element={<Cursos />} />
        <Route path="/busca/chatbot" element={<Chatbot />} />
        <Route path="/busca/:id/curso" element={<CursoDetail />} />
        <Route path="/busca/:id/faculdade" element={<FaculdadeDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/capelinhos" element={<Capelinhos />} />
        <Route path="/profile/historico" element={<Historico />} />
        <Route path="/profile/editar" element={<Editar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz-info" element={<QuizInfo />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
