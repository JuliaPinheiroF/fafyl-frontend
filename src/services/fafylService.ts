import { Fafyl, College, CourseImp } from '@/types';
import { request } from './api';
import { getAllCourses } from './courseService';
import { getAllColleges } from './collegeService';

export async function getRecommendations(discProfile: Record<string, number>): Promise<Fafyl[]> {
  try {
    return await request<Fafyl[]>('/fafyl', {
      method: 'GET',
      body: { discProfile },
      auth: true,
    });
  } catch {
    return computeMockRecommendations(discProfile);
  }
}

function dotProduct(profile: Record<string, number>, weights: Record<string, number>): number {
  if (!weights) return 0;
  let score = 0;
  for (const [key, value] of Object.entries(weights)) {
    score += value * (profile[key] || 0);
  }
  return score;
}

async function computeMockRecommendations(discProfile: Record<string, number>): Promise<Fafyl[]> {
  const courses = await getAllCourses();
  const fafyls: Fafyl[] = courses
    .map((course) => ({
      score: dotProduct(discProfile, course.discWeights),
      course,
    }))
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score);

  return fafyls;
}

export async function getCollegesWithCourse(courseId: number): Promise<{ college: College; courseImp: CourseImp }[]> {
  const colleges = await getAllColleges();

  return colleges.flatMap((college) =>
    college.courses
      .filter((imp) => imp.course.id === courseId)
      .map((courseImp) => ({ college, courseImp }))
  );
}
