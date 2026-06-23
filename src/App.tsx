import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import QuizInfo from '@/pages/QuizInfo';
import Busca from '@/pages/Busca';
import Sobre from '@/pages/Sobre';
import Faculdades from '@/pages/busca/Faculdades';
import Cursos from '@/pages/busca/Cursos';
import Chatbot from '@/pages/busca/Chatbot';
import CursoDetail from '@/pages/busca/CursoDetail';
import FaculdadeDetail from '@/pages/busca/FaculdadeDetail';
import Quiz from '@/pages/quiz/Quiz';
import Resultado from '@/pages/quiz/QuizResultado';
import Profile from '@/pages/profile/Profile';
import Capelinhos from '@/pages/profile/ProfileCapelinhos';
import Historico from '@/pages/profile/ProfileHistorico';
import Editar from '@/pages/profile/ProfileEditar';

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
