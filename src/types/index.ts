export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Course {
  id: number;
  name: string;
  abilities: string[];
  cantBe: string[];
  description: string;
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
