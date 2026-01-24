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
    user: {
      id: string,
      prenom: string,
      nom: string,
      email: string,
      role: UserRole,
      isActive: boolean
    }
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
  departements?: string[]; // Départements
  courses?: string[];
  isActive: boolean;      // Compte actif
  lastLogin?: string;     // Dernière connexion
  createdAt?: string;      // Date de création
}

export interface UserCreateDto {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  adresse?: string;
}

export interface UserUpdateDto {
  nom?: string;
  prenom?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  telephone?: string;
}

export interface UserStats {
  totalUsers: number;
  adminsCount: number;
  teachersCount: number;
  studentsCount: number;
  actifs: number;
  inactifs: number;
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

export interface Course {
  id: string
  name: string
  code: string
  credits: number
  students: number
  instructor: string
}

export interface Module {
  id: string
  name: string
  code: string
  semestre: string
  courses?: Course[]
}

export type DepartmentStatus = 'actif' | 'inactif';

export interface Department {
  couleur: any;
  isActive: boolean;
  id: string;
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