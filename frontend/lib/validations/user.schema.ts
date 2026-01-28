import { z } from 'zod';

// ==================== SCHÉMAS DE BASE ====================

// Schéma pour les champs communs
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
    .regex(/^(\+221|0)[1-9]\d{8}$/, { 
      message: 'Numéro de téléphone invalide. Format: +221771000000 ou 0771000000' 
    })
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
  
  isActive: z.boolean(),
};

// ==================== SCHÉMAS SPÉCIFIQUES AU RÔLE ====================

// Schéma Étudiant
const STUDENTSchema = z.object({
  ...userBaseFields,
  role: z.literal('STUDENT'),
  departement: z.string()
    .min(1, { message: 'Vous devez sélectionner un département' }),
  modules: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un module' }),
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
  departement: z.string()
    .min(1, { message: 'Vous devez sélectionner un département' }),
  modules: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un module' }),
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
  departement: z.string().optional().or(z.literal('')),
  modules: z.array(z.string()).optional().default([]),
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



// ==================== SCHÉMA POUR MISE À JOUR ====================

// Schéma de base pour la mise à jour (sans validation de mot de passe obligatoire)
const updateUserBaseFields = {
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
    .regex(/^(\+221|0)[1-9]\d{8}$/, { 
      message: 'Numéro de téléphone invalide. Format: +221771000000 ou 0771000000' 
    })
    .optional()
    .or(z.literal('')),
  
  password: z.string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/[A-Z]/, { message: 'Le mot de passe doit contenir au moins une majuscule' })
    .regex(/[a-z]/, { message: 'Le mot de passe doit contenir au moins une minuscule' })
    .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins un chiffre' })
    .regex(/[^A-Za-z0-9]/, { message: 'Le mot de passe doit contenir au moins un caractère spécial' })
    .optional()
    .or(z.literal('')),
  
  confirmPassword: z.string().optional().or(z.literal('')),
  
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
  
  isActive: z.boolean().default(true),
};

// Schéma Étudiant pour mise à jour
const STUDENTUpdateSchema = z.object({
  ...updateUserBaseFields,
  role: z.literal('STUDENT'),
  departement: z.string()
    .min(1, { message: 'Vous devez sélectionner un département' }),
  modules: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un module' }),
});

// Schéma TEACHER pour mise à jour
const teacherUpdateSchema = z.object({
  ...updateUserBaseFields,
  role: z.literal('TEACHER'),
  departement: z.string()
    .min(1, { message: 'Vous devez sélectionner un département' }),
  modules: z.array(z.string())
    .min(1, { message: 'Vous devez sélectionner au moins un module' }),
});

// Schéma ADMINistrateur pour mise à jour
const ADMINUpdateSchema = z.object({
  ...updateUserBaseFields,
  role: z.literal('ADMIN'),
  departement: z.string().optional().or(z.literal('')),
  modules: z.array(z.string()).optional().default([]),
});

// Schéma union pour mise à jour avec raffinement
export const updateUserSchema = z.discriminatedUnion('role', [
  STUDENTUpdateSchema,
  teacherUpdateSchema,
  ADMINUpdateSchema,
]).superRefine((data, ctx) => {
  // Validation conditionnelle du mot de passe
  const hasPassword = data.password && data.password.trim() !== '';
  const hasConfirmPassword = data.confirmPassword && data.confirmPassword.trim() !== '';
  
  if (hasPassword) {
    // Si un mot de passe est fourni, exiger la confirmation
    if (!hasConfirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La confirmation du mot de passe est requise',
        path: ['confirmPassword'],
      });
    }
    // Vérifier la correspondance des mots de passe
    else if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
      });
    }
  }
});



export type UserUpdateFormData = z.infer<typeof updateUserSchema>;

