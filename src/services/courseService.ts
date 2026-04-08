import { Course, CourseImp } from '@/types';
import { request } from './api';

const MOCK_COURSES: Course[] = [
  {
    id: 1,
    name: 'Engenharia de Software',
    abilities: ['Lógica', 'Programação', 'Sistemas', 'Home-office', 'Criatividade'],
    cantBe: ['Pessoas', 'Times', 'Longa jornada de trabalho'],
    description: 'Formação completa em desenvolvimento de software.',
  },
  {
    id: 2,
    name: 'Ciência da Computação',
    abilities: ['Matemática', 'Lógica', 'Pesquisa', 'Sistemas', 'Análise'],
    cantBe: ['Pessoas', 'Longa jornada de trabalho', 'Longo tempo de estudo'],
    description: 'Base teórica e prática em computação.',
  },
  {
    id: 3,
    name: 'Design Digital',
    abilities: ['Criatividade', 'Estética', 'Pessoas', 'Home-office'],
    cantBe: ['Hierarquização', 'Escritório rígido', 'Longo tempo de estudo'],
    description: 'Design voltado para interfaces e experiência do usuário.',
  },
  {
    id: 4,
    name: 'Administração de Empresas',
    abilities: ['Liderança', 'Comunicação', 'Pessoas', 'Times', 'Dinheiro', 'Resolver conflitos'],
    cantBe: ['Home-office', 'Longa jornada de trabalho', 'Hierarquização'],
    description: 'Gestão empresarial moderna e estratégica.',
  },
  {
    id: 5,
    name: 'Inteligência Artificial',
    abilities: ['Matemática', 'Análise', 'Sistemas', 'Longo tempo de estudo', 'Pesquisa'],
    cantBe: ['Pessoas', 'Times', 'Resolver conflitos', 'Periculosidade'],
    description: 'Machine learning, deep learning e processamento de linguagem natural.',
  },
  {
    id: 6,
    name: 'Sistemas de Informação',
    abilities: ['Sistemas', 'Programação', 'Comunicação', 'Organização', 'Home-office'],
    cantBe: ['Pessoas', 'Times', 'Periculosidade', 'Insalubridade'],
    description: 'Gestão de sistemas e tecnologia da informação.',
  },
  {
    id: 7,
    name: 'Marketing Digital',
    abilities: ['Criatividade', 'Comunicação', 'Pessoas', 'Análise', 'Dinheiro'],
    cantBe: ['Hierarquização', 'Longo tempo de estudo', 'Insalubridade'],
    description: 'Estratégias de marketing para o ambiente digital.',
  },
  {
    id: 8,
    name: 'Engenharia Civil',
    abilities: ['Matemática', 'Cálculo', 'Escritório', 'Resolver conflitos', 'Dinheiro'],
    cantBe: ['Home-office', 'Longa jornada de trabalho', 'Insalubridade', 'Periculosidade'],
    description: 'Projeto e construção de estruturas e edificações.',
  },
];

const MOCK_COURSE_IMPS: CourseImp[] = [
  {
    id: 1,
    name: 'Engenharia de Software - FAFYL',
    course: MOCK_COURSES[0],
    college: { id: 1, name: 'FAFYL', description: '', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '720' },
    details: 'Curso focado em práticas ágeis, arquitetura de software e engenharia de requisitos.',
    fees: 1200.0,
    locale: { lat: -23.5505, lon: -46.6333 },
  },
  {
    id: 2,
    name: 'Engenharia de Software - Tech Institute',
    course: MOCK_COURSES[0],
    college: { id: 2, name: 'Tech Institute', description: '', locale: { lat: -22.9068, lon: -43.1729 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '680' },
    details: 'Foco em engenharia de requisitos, qualidade de software e metodologias ágeis.',
    fees: 1350.0,
    locale: { lat: -22.9068, lon: -43.1729 },
  },
  {
    id: 3,
    name: 'Ciência da Computação - FAFYL',
    course: MOCK_COURSES[1],
    college: { id: 1, name: 'FAFYL', description: '', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '750' },
    details: 'Abrange algoritmos, estruturas de dados, inteligência artificial e teoria da computação.',
    fees: 1350.0,
    locale: { lat: -23.5505, lon: -46.6333 },
  },
  {
    id: 4,
    name: 'Ciência da Computação - Nova Academy',
    course: MOCK_COURSES[1],
    college: { id: 3, name: 'Nova Academy', description: '', locale: { lat: -19.9167, lon: -43.9345 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '710' },
    details: 'Ênfase em IA, machine learning e ciência de dados.',
    fees: 1400.0,
    locale: { lat: -19.9167, lon: -43.9345 },
  },
  {
    id: 5,
    name: 'Design Digital - Tech Institute',
    course: MOCK_COURSES[2],
    college: { id: 2, name: 'Tech Institute', description: '', locale: { lat: -22.9068, lon: -43.1729 }, image: '', courses: [] },
    note: { 'Duração': '3 anos', 'Turno': 'Noturno', 'Nota de corte': '620' },
    details: 'UX/UI, design thinking, prototipação e pesquisa com usuários.',
    fees: 980.0,
    locale: { lat: -22.9068, lon: -43.1729 },
  },
  {
    id: 6,
    name: 'Administração de Empresas - Future School',
    course: MOCK_COURSES[3],
    college: { id: 4, name: 'Future School', description: '', locale: { lat: -30.0346, lon: -51.2177 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '650' },
    details: 'Finanças, marketing, RH, estratégia e empreendedorismo.',
    fees: 850.0,
    locale: { lat: -30.0346, lon: -51.2177 },
  },
  {
    id: 7,
    name: 'Administração de Empresas - FAFYL',
    course: MOCK_COURSES[3],
    college: { id: 1, name: 'FAFYL', description: '', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Noturno', 'Nota de corte': '600' },
    details: 'Gestão de negócios digitais, startups e inovação corporativa.',
    fees: 900.0,
    locale: { lat: -23.5505, lon: -46.6333 },
  },
  {
    id: 8,
    name: 'Inteligência Artificial - Smart College',
    course: MOCK_COURSES[4],
    college: { id: 5, name: 'Smart College', description: '', locale: { lat: -25.4284, lon: -49.2733 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '780' },
    details: 'Redes neurais, NLP, visão computacional e robótica inteligente.',
    fees: 1500.0,
    locale: { lat: -25.4284, lon: -49.2733 },
  },
  {
    id: 9,
    name: 'Inteligência Artificial - Nova Academy',
    course: MOCK_COURSES[4],
    college: { id: 3, name: 'Nova Academy', description: '', locale: { lat: -19.9167, lon: -43.9345 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Integral', 'Nota de corte': '760' },
    details: 'Deep learning, processamento de linguagem natural e visão computacional.',
    fees: 1450.0,
    locale: { lat: -19.9167, lon: -43.9345 },
  },
  {
    id: 10,
    name: 'Sistemas de Informação - Nova Academy',
    course: MOCK_COURSES[5],
    college: { id: 3, name: 'Nova Academy', description: '', locale: { lat: -19.9167, lon: -43.9345 }, image: '', courses: [] },
    note: { 'Duração': '4 anos', 'Turno': 'Noturno', 'Nota de corte': '640' },
    details: 'Banco de dados, redes, governança de TI e segurança da informação.',
    fees: 1100.0,
    locale: { lat: -19.9167, lon: -43.9345 },
  },
  {
    id: 11,
    name: 'Marketing Digital - Future School',
    course: MOCK_COURSES[6],
    college: { id: 4, name: 'Future School', description: '', locale: { lat: -30.0346, lon: -51.2177 }, image: '', courses: [] },
    note: { 'Duração': '3 anos', 'Turno': 'Noturno', 'Nota de corte': '580' },
    details: 'SEO, mídias sociais, analytics, branding e growth hacking.',
    fees: 780.0,
    locale: { lat: -30.0346, lon: -51.2177 },
  },
  {
    id: 12,
    name: 'Engenharia Civil - Tech Institute',
    course: MOCK_COURSES[7],
    college: { id: 2, name: 'Tech Institute', description: '', locale: { lat: -22.9068, lon: -43.1729 }, image: '', courses: [] },
    note: { 'Duração': '5 anos', 'Turno': 'Integral', 'Nota de corte': '700' },
    details: 'Cálculo estrutural, materiais de construção, geotecnia e gestão de obras.',
    fees: 1450.0,
    locale: { lat: -22.9068, lon: -43.1729 },
  },
  {
    id: 13,
    name: 'Engenharia Civil - FAFYL',
    course: MOCK_COURSES[7],
    college: { id: 1, name: 'FAFYL', description: '', locale: { lat: -23.5505, lon: -46.6333 }, image: '', courses: [] },
    note: { 'Duração': '5 anos', 'Turno': 'Integral', 'Nota de corte': '690' },
    details: 'Estruturas metálicas, concreto armado, hidráulica e saneamento.',
    fees: 1380.0,
    locale: { lat: -23.5505, lon: -46.6333 },
  },
];

export async function getAllCourses(): Promise<Course[]> {
  try {
    return await request<Course[]>('/model/course');
  } catch {
    return MOCK_COURSES;
  }
}

export async function getAllCourseImps(): Promise<CourseImp[]> {
  try {
    return await request<CourseImp[]>('/course');
  } catch {
    return MOCK_COURSE_IMPS;
  }
}

export async function getCourseImpsByCourseId(courseId: number): Promise<CourseImp[]> {
  const allImps = await getAllCourseImps();
  return allImps.filter((imp) => imp.course.id === courseId);
}
