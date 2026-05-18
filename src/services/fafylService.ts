import { Fafyl, College, CourseImp } from '@/types';
import { request } from './api';
import { getAllCourses } from './courseService';
import { getAllColleges, getCollegeCourses } from './collegeService';

export async function getRecommendations(discProfile: Record<string, number>): Promise<Fafyl[]> {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ENV === 'development' ? 'http://localhost:8080' : 'https://recommend-1-0.onrender.com'}/fafyl`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discProfile }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
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
  try {
    const colleges = await getAllColleges();
    const results: { college: College; courseImp: CourseImp }[] = [];

    for (const college of colleges) {
      const imps = await getCollegeCourses(college.id);
      const matchingImp = imps.find((imp) => imp.course.id === courseId);
      if (matchingImp) {
        results.push({ college, courseImp: matchingImp });
      }
    }

    return results;
  } catch {
    return [];
  }
}
