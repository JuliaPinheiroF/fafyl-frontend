export interface ChatMessage {
  id: string;
  text: string;
  role: 'user' | 'bot';
  timestamp: Date;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Course {
  id: number;
  name: string;
  discWeights: Record<string, number>;
  description: string;
  category?: CourseCategory;
}

export interface College {
  id: number;
  name: string;
  description: string;
  locale: Coordinates;
  image: string;
  courses: CourseImp[];
}

export interface CourseImp {
  id: number;
  name: string;
  course: Course;
  college: College;
  note: Record<string, any>;
  details: string;
  fees: number;
  locale: Coordinates;
}

export interface Quiz {
  discProfile: Record<string, number>;
}

export interface Fafyl {
  score: number;
  course: Course;
}

export interface Question {
  id: number;
  text: string;
  alternatives: Alternative[];
}

export interface Alternative {
  id: number;
  text: string;
  dimension: string;
  weight: number;
}

export interface QuestionDTO {
  text: string;
  alternatives: AlternativeDTO[];
}

export interface AlternativeDTO {
  text: string;
  dimension: string;
  weight: number;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  locale: Coordinates;
  capelinho?: number;
}

export interface CourseFilters {
  category?: string;
  minFees?: number;
  maxFees?: number;
  period?: string;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface CollegeFilters {
  lat?: number;
  lon?: number;
  maxDistance?: number;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export type CourseCategory = 'EXATAS' | 'SAUDE' | 'HUMANAS' | 'CRIATIVAS' | 'COMUNICACAO';
export type CoursePeriod = 'matutino' | 'vespertino' | 'noturno';
