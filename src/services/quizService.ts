import { USE_MOCKS } from '@/config/env';
import { Question, Alternative } from '@/types';
import { request } from './api';

const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Você prefere tomar a frente em situações de grupo?',
    alternatives: [
      { id: 1, text: 'Sempre, gosto de liderar', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Às vezes, se necessário', dimension: 'D', weight: 0.5 },
      { id: 3, text: 'Prefiro acompanhar', dimension: 'S', weight: 0.8 },
      { id: 4, text: 'Evito a todo custo', dimension: 'C', weight: 0.3 },
    ],
  },
  {
    id: 2,
    text: 'Como você lida com prazos apertados?',
    alternatives: [
      { id: 1, text: 'Foco e ação imediata', dimension: 'D', weight: 0.9 },
      { id: 2, text: 'Converso com a equipe para resolver', dimension: 'I', weight: 0.7 },
      { id: 3, text: 'Sigo o processo com calma', dimension: 'S', weight: 0.6 },
      { id: 4, text: 'Analiso cada detalhe antes de agir', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 3,
    text: 'Em um projeto, o que mais te motiva?',
    alternatives: [
      { id: 1, text: 'Alcançar resultados e superar metas', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Colaborar e interagir com pessoas', dimension: 'I', weight: 0.9 },
      { id: 3, text: 'Ter estabilidade e rotina clara', dimension: 'S', weight: 0.8 },
      { id: 4, text: 'Garantir precisão e qualidade', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 4,
    text: 'Como você prefere resolver conflitos?',
    alternatives: [
      { id: 1, text: 'Decido rápido e sigo em frente', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Uso diálogo e persuasão', dimension: 'I', weight: 0.8 },
      { id: 3, text: 'Busco harmonia e consenso', dimension: 'S', weight: 0.9 },
      { id: 4, text: 'Analiso fatos e regras aplicáveis', dimension: 'C', weight: 0.7 },
    ],
  },
  {
    id: 5,
    text: 'Qual ambiente de trabalho te combina mais?',
    alternatives: [
      { id: 1, text: 'Competitivo e desafiador', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Dinâmico e social', dimension: 'I', weight: 0.9 },
      { id: 3, text: 'Organizado e previsível', dimension: 'S', weight: 0.8 },
      { id: 4, text: 'Técnico e baseado em dados', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 6,
    text: 'Quando precisa aprender algo novo, como procede?',
    alternatives: [
      { id: 1, text: 'Vou direto à prática, aprendo fazendo', dimension: 'D', weight: 0.8 },
      { id: 2, text: 'Peço ajuda a alguém experiente', dimension: 'I', weight: 0.6 },
      { id: 3, text: 'Sigo um passo a passo estruturado', dimension: 'S', weight: 0.9 },
      { id: 4, text: 'Estudo a teoria completamente antes', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 7,
    text: 'O que te incomoda mais em um colega?',
    alternatives: [
      { id: 1, text: 'Lentidão e indecisão', dimension: 'D', weight: 0.9 },
      { id: 2, text: 'Frieza e falta de comunicação', dimension: 'I', weight: 0.8 },
      { id: 3, text: 'Imprevisibilidade e mudanças constantes', dimension: 'S', weight: 1.0 },
      { id: 4, text: 'Desleixo e falta de rigor', dimension: 'C', weight: 0.9 },
    ],
  },
  {
    id: 8,
    text: 'Como você toma decisões importantes?',
    alternatives: [
      { id: 1, text: 'Rápido, confio no instinto', dimension: 'D', weight: 0.8 },
      { id: 2, text: 'Consulto pessoas de confiança', dimension: 'I', weight: 0.7 },
      { id: 3, text: 'Penso com calma e pondero', dimension: 'S', weight: 0.9 },
      { id: 4, text: 'Reúno todos os dados possíveis', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 9,
    text: 'Qual tipo de tarefa te dá mais energia?',
    alternatives: [
      { id: 1, text: 'Resolver problemas complexos sozinho', dimension: 'D', weight: 0.7 },
      { id: 2, text: 'Apresentar ideias e inspirar outros', dimension: 'I', weight: 1.0 },
      { id: 3, text: 'Ajudar alguém diretamente', dimension: 'S', weight: 0.9 },
      { id: 4, text: 'Organizar informações e criar padrões', dimension: 'C', weight: 0.8 },
    ],
  },
  {
    id: 10,
    text: 'Como você reage a mudanças inesperadas?',
    alternatives: [
      { id: 1, text: 'Encaro como desafio e adapto rápido', dimension: 'D', weight: 0.9 },
      { id: 2, text: 'Fico animado com novas possibilidades', dimension: 'I', weight: 0.8 },
      { id: 3, text: 'Prefiro aviso prévio, mas me ajusto', dimension: 'S', weight: 0.7 },
      { id: 4, text: 'Analiso o impacto antes de mudar', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 11,
    text: 'O que mais te satisfaz no trabalho?',
    alternatives: [
      { id: 1, text: 'Ver resultados concretos e rápidos', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Reconhecimento e relações positivas', dimension: 'I', weight: 0.9 },
      { id: 3, text: 'Segurança e continuidade', dimension: 'S', weight: 0.8 },
      { id: 4, text: 'Excelência e precisão no entregável', dimension: 'C', weight: 1.0 },
    ],
  },
  {
    id: 12,
    text: 'Como você descreveria seu estilo de comunicação?',
    alternatives: [
      { id: 1, text: 'Direto e objetivo', dimension: 'D', weight: 1.0 },
      { id: 2, text: 'Expressivo e entusiasta', dimension: 'I', weight: 0.9 },
      { id: 3, text: 'Calmo e acolhedor', dimension: 'S', weight: 0.8 },
      { id: 4, text: 'Detalhado e preciso', dimension: 'C', weight: 1.0 },
    ],
  },
];

export async function getQuestions(): Promise<Question[]> {
  if (USE_MOCKS) return MOCK_QUESTIONS;
  try {
    return await request<Question[]>('/data/questions');
  } catch {
    return MOCK_QUESTIONS;
  }
}

export function computeDiscProfile(
  answers: Map<number, number>,
  questions: Question[]
): Record<string, number> {
  const profile: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

  answers.forEach((altId, questionId) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const alternative = question.alternatives.find((a) => a.id === altId);
    if (!alternative) return;

    const dim = alternative.dimension;
    if (profile[dim] !== undefined) {
      profile[dim] += alternative.weight;
    }
  });

  return profile;
}

export { MOCK_QUESTIONS };
