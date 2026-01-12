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
    role: UserRole;        // Rôles (ADMIN, USER, etc.)
    permissions?: string[];  // Permissions spécifiques
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
  phone?: string;
  adresse?: string;
  photo?: string;
}

export interface UserStats {
  total: number;
  admins: number;
  enseignants: number;
  etudiants: number;
  actifs: number;
  inactifs: number;
}

export interface UsersResponse {
  users: User[];
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

export type DepartmentStatus = 'actif' | 'inactif' ;

export interface Department {
  id: string;
  code: string;
  nom: string;
  description?: string;
  directeur: string; // ID ou nom du directeur
  directeurNom?: string; // Nom complet du directeur
  email: string;
  telephone?: string;
  batiment: string;
  etage?: number;
  performance: number; // 0-100
  enseignantsCount: number;
  etudiantsCount: number;
  modulesCount: number;
  budgetAnnuel: number;
  status: DepartmentStatus;
  dateCreation: string;
  dateModification?: string;
  couleur?: string;
  logo?: string;
}

export interface DepartmentCreateDto {
  code: string;
  nom: string;
  description?: string;
  directeur: string; // ID du directeur
  email: string;
  telephone?: string;
  batiment: string;
  etage?: number;
  budgetAnnuel: number;
  couleur?: string;
}

export interface DepartmentUpdateDto {
  nom?: string;
  description?: string;
  directeur?: string;
  email?: string;
  telephone?: string;
  batiment?: string;
  etage?: number;
  budgetAnnuel?: number;
  status?: DepartmentStatus;
  couleur?: string;
  logo?: string;
}

export interface DepartmentStats {
  total: number;
  actifs: number;
  inactifs: number;
  totalEnseignants: number;
  totalEtudiants: number;
  totalModules: number;
  budgetTotal: number;
}

export interface DepartmentsResponse {
  departments: Department[];
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
  batiment?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}