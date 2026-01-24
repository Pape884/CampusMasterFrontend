import { z } from 'zod';

// ==================== SCHÉMAS DE BASE ====================

// Schéma pour les champs communs SANS raffinement
const userBaseFields = {
  nom: z.string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
    .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Le nom contient des caractères invalides' }),
  
  prenom: z.string()
    .min(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
    .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: 'Le prénom contient des caractères invalides' }),
  
  email: z.string()
    .email({ message: 'Adresse email invalide' })
    .max(100, { message: 'L\'email ne peut pas dépasser 100 caractères' }),
  
  telephone: z.string()
    .regex(/^[1-9]/, { message: 'Numéro de téléphone invalide' })
    .optional()
    .or(z.literal('')),

  
  password: z.string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' }),
  
  confirmPassword: z.string(),
  
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  
  departements: z.array(z.string()).default([]),
  
  cours: z.array(z.string()).default([]),
  
  isActive: z.boolean().default(true),
  
  permissions: z.object({
    gestionUtilisateurs: z.boolean().default(false),
    gestionDepartements: z.boolean().default(false),
    gestionCours: z.boolean().default(false),
  }).optional(),
};

// ==================== SCHÉMAS SPÉCIFIQUES AU RÔLE ====================

// Schéma Étudiant
const STUDENTSchema = z.object({
  ...userBaseFields,
  role: z.literal('STUDENT'),
  departements: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un département' })
    .max(1, { message: 'Un étudiant ne peut être que dans un département' }),
  cours: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un cours' }),
})
.superRefine((data, ctx) => {

  // Validation confirmation mot de passe
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }
});

// Schéma TEACHER
const teacherSchema = z.object({
  ...userBaseFields,
  role: z.literal('TEACHER'),
  departements: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un département' }),
  cours: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un cours' }),
})
.superRefine((data, ctx) => {
  

  // Validation confirmation mot de passe
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }
});

// Schéma ADMINistrateur
const ADMINSchema = z.object({
  ...userBaseFields,
  role: z.literal('ADMIN'),
})
.superRefine((data, ctx) => {

  // Validation confirmation mot de passe
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword'],
    });
  }
});

// ==================== SCHÉMA UNION ====================

export const userSchema = z.discriminatedUnion('role', [
  STUDENTSchema,
  teacherSchema,
  ADMINSchema,
]);

// ==================== TYPES ====================

export type UserFormData = z.infer<typeof userSchema>;
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';
export type UserStatus = 'actif' | 'inactif';

export interface CreateUserRequest {
  matricule?: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: UserRole;
  telephone?: string;
  departements: string[];
  cours: string[];
  isActive: boolean;
  permissions?: {
    gestionUtilisateurs: boolean;
    gestionDepartements: boolean;
    gestionCours: boolean;
  };
}

export interface User {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  telephone?: string;
  departements: string[];
  cours: string[];
  isActive: boolean;
  permissions?: {
    gestionUtilisateurs: boolean;
    gestionDepartements: boolean;
    gestionCours: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

// ==================== UTILITAIRES ====================

/**
 * Génère un matricule automatique
 */
export function generateMatricule(role: UserRole, index: number): string {
  const prefixes = {
    ADMIN: 'ADM',
    TEACHER: 'ENS',
    STUDENT: 'ETU'
  };
  
  return `${prefixes[role]}${String(index).padStart(4, '0')}`;
}

/**
 * Formate le rôle pour l'affichage
 */
export function formatRoleForDisplay(role: UserRole): string {
  const labels = {
    ADMIN: 'Administrateur',
    TEACHER: 'Enseignant',
    STUDENT: 'Étudiant'
  };
  return labels[role];
}


/**
 * Validation supplémentaire pour le téléphone
 */
export function validatePhone(telephone?: string): string | null {
  if (!telephone) return null;
  
  const phoneRegex = /^(\+221|0)[1-9]{2}$/;
  if (!phoneRegex.test(telephone.replace(/\s/g, ''))) {
    return 'Numéro de téléphone invalide. Format: +221 77 100 00 00';
  }
  
  return null;
}

/**
 * Validation supplémentaire pour le mot de passe
 */
export function validatePassword(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Les mots de passe ne correspondent pas';
  }
  
  if (password.length < 8) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une majuscule';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Le mot de passe doit contenir au moins une minuscule';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Le mot de passe doit contenir au moins un chiffre';
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Le mot de passe doit contenir au moins un caractère spécial';
  }
  
  return null;
}

/**
 * Validation en temps réel pour un champ spécifique
 */
export type ValidationRule = (value: any, formValues?: any, role?: UserRole) => string | null;

export const validationRules: Record<string, ValidationRule> = {
  nom: (value: string) => {
    if (!value) return 'Le nom est requis';
    if (value.length < 2) return 'Le nom doit contenir au moins 2 caractères';
    if (value.length > 50) return 'Le nom ne peut pas dépasser 50 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return 'Le nom contient des caractères invalides';
    return null;
  },
  
  prenom: (value: string) => {
    if (!value) return 'Le prénom est requis';
    if (value.length < 2) return 'Le prénom doit contenir au moins 2 caractères';
    if (value.length > 50) return 'Le prénom ne peut pas dépasser 50 caractères';
    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) return 'Le prénom contient des caractères invalides';
    return null;
  },
  
  email: (value: string) => {
    if (!value) return 'L\'email est requis';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Adresse email invalide';
    if (value.length > 100) return 'L\'email ne peut pas dépasser 100 caractères';
    return null;
  },
  
  telephone: (value: string) => {
    if (!value) return null;
    if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(value.replace(/\s/g, ''))) {
      return 'Numéro de téléphone invalide';
    }
    return null;
  },
  

  
  password: (value: string) => {
    if (!value) return 'Le mot de passe est requis';
    if (value.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    if (!/[A-Z]/.test(value)) return 'Le mot de passe doit contenir au moins une majuscule';
    if (!/[a-z]/.test(value)) return 'Le mot de passe doit contenir au moins une minuscule';
    if (!/[0-9]/.test(value)) return 'Le mot de passe doit contenir au moins un chiffre';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Le mot de passe doit contenir au moins un caractère spécial';
    return null;
  },
  
  confirmPassword: (value: string, formValues?: any) => {
    if (!value) return 'La confirmation du mot de passe est requise';
    if (formValues && formValues.password !== value) {
      return 'Les mots de passe ne correspondent pas';
    }
    return null;
  },
  
  departements: (value: string[], role?: UserRole) => {
    if (role === 'STUDENT') {
      if (!value || value.length === 0) return 'Vous devez sélectionner un département';
      if (value.length > 1) return 'Un étudiant ne peut être que dans un département';
    }
    
    if (role === 'TEACHER') {
      if (!value || value.length === 0) return 'Vous devez sélectionner au moins un département';
    }
    
    return null;
  },
  
  cours: (value: string[], role?: UserRole) => {
    if (role === 'STUDENT' || role === 'TEACHER') {
      if (!value || value.length === 0) return 'Vous devez sélectionner au moins un cours';
    }
    return null;
  },
};

/**
 * Fonction utilitaire pour valider un champ en temps réel
 */
export function validateField(
  fieldName: string, 
  value: any, 
  formValues?: any,
  role?: UserRole
): string | null {
  const rule = validationRules[fieldName];
  if (!rule) return null;
  
  return rule(value, formValues, role);
}

/**
 * Validation complète du formulaire
 */
export function validateForm(data: Partial<UserFormData>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.keys(data).forEach(key => {
    const value = data[key as keyof UserFormData];
    const error = validateField(key, value, data, data.role);
    
    if (error) {
      errors[key] = error;
    }
  });
  
  // Validation croisée des mots de passe
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas';
  }
  
  return errors;
}