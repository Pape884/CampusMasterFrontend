'use client';

import { useState, useEffect } from 'react';
import { departmentService } from '@/lib/api/services/department.service';
import { Department, Module } from '../api/services';
import { moduleService } from '../api/services/module.service';


export interface FormDataState {
  departments: Department[];
  modules: Module[];
  isLoading: boolean;
  error: string | null;
}

export function useFormData() {
  const [state, setState] = useState<FormDataState>({
    departments: [],
    modules: [],
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

        console.log("Departments:", departmentsResponse.data);

        // Récupérer les cours
        const modulesResponse = await moduleService.getAll();
        console.log("Modules:", modulesResponse);
    

        setState({
          departments: departmentsResponse.data,
          modules: modulesResponse,
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

  // Filtrer les modules par département
  const getModuleByDepartment = (departmentId: string): Module[] => {
    return state.modules.filter(module => module.departmentId === departmentId);
  };

  // Obtenir le nom d'un département par son ID
  const getDepartmentName = (departmentId: string): string => {
    const dept = state.departments.find(d => d.id === departmentId);
    return dept?.name || departmentId;
  };


  return {
    ...state,
    getModuleByDepartment,
    getDepartmentName,
  };
}