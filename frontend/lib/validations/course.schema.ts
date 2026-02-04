import z from "zod"

// Schéma de validation
export const courseSchema = z.object({
    titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
    code: z.string().min(2, "Le code doit contenir au moins 2 caractères")
        .regex(/^[A-Z0-9]+$/, { message: 'Le code doit contenir uniquement des majuscules et des chiffres' }),
    description: z.string()
        .max(1000, { message: 'La description ne peut pas dépasser 1000 caractères' })
        .optional()
        .or(z.literal('')),
    credits: z.string().min(1, "Le nombre de crédits est requis"),
    moduleId: z.string().min(1, "Vous devez sélectionner un module"),
    status: z.enum(['draft', 'published', 'archived'])
        .default('draft'),
    

})


export type CourseFormData = z.infer<typeof courseSchema>