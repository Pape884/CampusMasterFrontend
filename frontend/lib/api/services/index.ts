export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type UserStatus = "actif" | "inactif";
/**
 * Interface pour les credentials de connexion
 */
export interface LoginCredentials {
  email: string;          // Email de l'utilisateur
  password: string;       // Mot de passe
  rememberMe?: boolean;   // Option "se souvenir de moi"
}



/**
 * Réponse de l'API après authentification réussie
 */
export interface AuthResponse {
  success: Boolean,
  message: string,
  data: {
    token: string,
    refreshToken: string
    user: User
  },
  timestamp: Date
}

/**
 * Réponse pour le refresh token
 */
export interface RefreshTokenResponse {
  access_token: string;   // Nouveau token d'accès
  refresh_token: string;  // Nouveau token de rafraîchissement
  expires_in: number;     // Nouvelle durée de validité
}

/**
 * Interface de l'utilisateur
 */
export interface User {
  id: string;             // Identifiant unique
  matricule?: string;     // Matricule
  email: string;          // Email
  prenom?: string;     // Prénom
  nom?: string;      // Nom
  telephone?: string;   // Téléphone
  role: UserRole;        // Rôles (ADMIN, USER, etc.)
  departement: string; // Départements
  modules?: string[];
  isActive: boolean;      // Compte actif
  lastLogin?: string;     // Dernière connexion
  createdAt?: string;      // Date de création
}

export interface CreateUserRequest {
  matricule?: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  telephone?: string;
  departement: string;
  modules: string[];
  isActive: boolean;

}

export interface UserUpdateDto {
  email?: string;          // Email
  prenom?: string;     // Prénom
  nom?: string;      // Nom
  password?: string;
  telephone?: string;   // Téléphone
  role?: UserRole;        // Rôles (ADMIN, USER, etc.)
  departement?: string; // Départements
  modules?: string[];
  isActive?: boolean;      // Compte actif
  lastLogin?: string;     // Dernière connexion
  createdAt?: string;      // Date de création
}

export interface UserStats {
  totalUsers: number;
  adminsCount: number;
  teachersCount: number;
  studentsCount: number;
  actifs: number;
  inactifs: number;
}

export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
/*

// forme des donnees recuperer dans le backend
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  },
  "stats": {
    "totalUsers": 2,
    "activeUsers": 2,
    "inactiveUsers": 0,
    "studentsCount": 0,
    "teachersCount": 0,
    "adminsCount": 2
  }
}
*/
export interface UsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: UserStats;
}


/**
 * les types et structures liés aux departements
 * 
 */

export interface Module {
  id: string
  name: string
  code: string
  semestre: string
  departmentId: string
  department?: Department[]
  courses?: Course[]
}

export interface modulesResponse {
  message: string
  data: Module[];
}

export type DepartmentStatus = 'actif' | 'inactif';

export interface Department {
  id: string;
  couleur: any;
  isActive: boolean;
  code: string;
  name: string;
  description: string;
  teachersCount: number;
  studentsCount: number;
  modulesCount: number;
  coursesCount: number;
  modules?: Module[];
}

export interface DepartmentCreateDto {
  code: string;
  name: string;
  description?: string;
  modules?: Module[];
}

export interface DepartmentUpdateDto {
  code?: string;
  name?: string;
  description?: string;
  modules?: Module[];
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  totalModules: number
}

export interface DepartmentsResponse {
  data: Department[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: DepartmentStats;
}

export interface DepartmentFilters {
  search?: string;
  status?: DepartmentStatus | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


/* =========================
   TYPES MODULES  
========================= */

export interface Module {
  id: string
  name: string
  code: string
  departmentId: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateModuleRequest {
  name: string
  code: string
  departmentId: string
  isActive?: boolean
}

export interface UpdateModuleRequest {
  name?: string
  code?: string
  departmentId?: string
  isActive?: boolean
}

/**
 * TYPES DE COURSES
 */

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  courseId?: string
  order: number;
  content?: string;
  resources?: Array<{
    id: string;
    name: string;
    type: 'pdf' | 'video' | 'link' | 'document';
    url: string;
    size?: string;
  }>;
  completed: boolean;
  duration: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  titre: string;
  code: string;
  description?: string;
  credits: string;
  moduleId: string;
  chaptersCount: number;
  studentsCount: number;
  startDate: Date;
  endDate: Date;
  progress: number; // Pourcentage moyen de progression des étudiants
  status: 'published' | 'draft' | 'archived';
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  chapters?: Chapter[];
}

export interface CourseUpdateDto {
  titre: string;
  code: string;
  credits: string;
  moduleId: string;
  status: 'published' | 'draft' | 'archived';
  description?: string;

}

//creation de coursDTO
export interface CourseCreateDto {
  titre: string;
  code: string;
  credits: string;
  moduleId: string;
  status: 'published' | 'draft' | 'archived';
  description?: string ;
}

//Response de l'api cours
export interface CourseResponse{
  success: boolean,
  message: string
  data: Course[],
  timestamp: Date

}