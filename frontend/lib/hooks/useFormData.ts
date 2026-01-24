'use client';

import { useState, useEffect } from 'react';
import { departmentService } from '@/lib/api/services/department.service';

export interface Department {
  id: string;
  code: string;
  name: string;
}

export interface Course {
  id: string;
  code: string;
  nom: string;
  departmentId?: string;
}

export interface FormDataState {
  departments: Department[];
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

export function useFormData() {
  const [state, setState] = useState<FormDataState>({
    departments: [],
    courses: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        // Récupérer les départements actifs
        const departmentsResponse = await departmentService.getDepartments({
          status: 'actif',
          limit: 100,
        });

        // Récupérer les cours
       /* const coursesResponse = await coursesService.getCourses({
            status: 'actif',
            limit: 100,
        });*/
        // Note: Tu devras créer un service cours ou adapter selon ton API
        const mockCourses: Course[] = [
          { id: '1', code: 'MATH101', nom: 'Algèbre Linéaire', departmentId: '1' },
          { id: '2', code: 'MATH201', nom: 'Analyse Numérique', departmentId: '1' },
          { id: '3', code: 'PHYS101', nom: 'Physique Quantique', departmentId: '2' },
          { id: '4', code: 'INFO101', nom: 'Programmation Python', departmentId: '5' },
          { id: '5', code: 'LANG101', nom: 'Anglais Avancé', departmentId: '3' },
        ];

        setState({
          departments: departmentsResponse.data,
          courses: mockCourses,
          isLoading: false,
          error: null,
        });

      } catch (error: any) {
        console.error('Erreur lors du chargement des données:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message || 'Erreur de chargement des données',
        }));
      }
    };

    fetchData();
  }, []);

  // Filtrer les cours par département
  const getCoursesByDepartment = (departmentId: string): Course[] => {
    return state.courses.filter(course => course.departmentId === departmentId);
  };

  // Obtenir le nom d'un département par son ID
  const getDepartmentName = (departmentId: string): string => {
    const dept = state.departments.find(d => d.id === departmentId);
    return dept?.name || departmentId;
  };

  // Obtenir le nom d'un cours par son ID
  const getCourseName = (courseId: string): string => {
    const course = state.courses.find(c => c.id === courseId);
    return course?.nom || courseId;
  };

  return {
    ...state,
    getCoursesByDepartment,
    getDepartmentName,
    getCourseName,
  };
}