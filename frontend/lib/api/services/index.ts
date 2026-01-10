
/**
 * Interface pour les credentials de connexion
 */
export interface LoginCredentials {
    email: string;          // Email de l'utilisateur
    password: string;       // Mot de passe
    rememberMe?: boolean;   // Option "se souvenir de moi"
}

/**
 * Interface pour l'inscription d'un nouvel utilisateur
 */
export interface RegisterData {
    email: string;          // Email
    password: string;       // Mot de passe
    confirmPassword: string; // Confirmation mot de passe
    firstName?: string;     // Prénom
    lastName?: string;      // Nom de famille
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
      role: string,
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
    email: string;          // Email
    prenom?: string;     // Prénom
    nom?: string;      // Nom
    role: string;        // Rôles (ADMIN, USER, etc.)
    permissions?: string[];  // Permissions spécifiques
    isActive: boolean;      // Compte actif
    lastLogin?: string;     // Dernière connexion
    createdAt?: string;      // Date de création
}