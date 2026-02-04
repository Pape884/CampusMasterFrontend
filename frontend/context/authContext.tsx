"use client";

/**
 * CONTEXTE D'AUTHENTIFICATION - Version corrigée
 * 
 * Ce fichier définit le contexte React pour gérer l'état d'authentification
 * à travers toute l'application Next.js.
 * 
 * Utilisation:
 * 1. Envelopper votre app avec <AuthProvider>
 * 2. Utiliser useAuthContext() dans les composants pour accéder à l'état
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode,
  useCallback,
  useMemo 
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services/auth.service';
import { LoginCredentials, User } from '@/lib/api/services';


// Type du contexte
interface AuthContextType {
  // État
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearAuthData: () => void;
  /*
  // Utilitaires
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  */
}

/**
 * Création du contexte avec une valeur par défaut undefined
 * Cette valeur sera fournie par AuthProvider
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * PROVIDER D'AUTHENTIFICATION
 * 
 * Ce composant doit envelopper l'application dans layout.tsx
 * pour fournir le contexte d'authentification à tous les composants enfants.
 */
export function AuthProvider({ 
  children 
}: { 
  children: ReactNode 
}) {
  const router = useRouter();
  
  // États
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  /**
   * INITIALISATION DE L'AUTHENTIFICATION
   * Vérifie si l'utilisateur est déjà connecté au chargement de l'app
   */
  const initializeAuth = useCallback(async () => {
    console.log('🔄 Initialisation de l\'authentification...');
    
    try {
      if (typeof window !== 'undefined') {
        // Vérifier le token dans localStorage
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          // Récupérer l'utilisateur depuis localStorage
          const storedUser = await authService.getCurrentUser();
          
          if (storedUser) {
            console.log('✅ Utilisateur trouvé en cache:', storedUser.email);
            setUser(storedUser);
          } else {
            // Token existe mais pas d'utilisateur -> nettoyage
            console.log('⚠️ Token sans utilisateur, nettoyage...');
            authService.clearAuthData();
          }
        } else {
          console.log('ℹ️ Aucun utilisateur authentifié');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ Erreur d\'initialisation:', error);
      setUser(null);
      authService.clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initialisation au montage
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  /**
   * CONNEXION
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Tentative de connexion...');
      
      // Appel au service d'authentification
      const response = await authService.login(credentials);
      
      // Mise à jour de l'état
      setUser(response.data.user);
      console.log('✅ Connexion réussie pour:', response.data.user.email);
      
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      setUser(null);
      authService.clearAuthData();
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * DÉCONNEXION
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      console.log('👋 Déconnexion...');
      
      // Appel au service
      await authService.logout();
      
      // Mise à jour de l'état
      setUser(null);
      console.log('✅ Déconnexion réussie');
      
      // Redirection vers la page d'accueil
      router.push('/');
      router.refresh();
      
    } catch (error) {
      console.error('❌ Erreur de déconnexion:', error);
      // Forcer le nettoyage même en cas d'erreur
      authService.clearAuthData();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  

  
  /**
   * RAFRAÎCHISSEMENT DE L'UTILISATEUR
   * Force le rechargement des données utilisateur
   */
  const refreshUser = useCallback(async () => {
    try {
      console.log('🔄 Rafraîchissement des données utilisateur...');
      
      if (typeof window !== 'undefined') {
        // Dans une vraie implémentation, on ferait une requête API
        // Pour l'instant, on relit depuis localStorage
        const storedUser = await authService.getCurrentUser();
        
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (error) {
      console.error('❌ Erreur de rafraîchissement:', error);
    }
  }, []);
  
  /**
   * NETTOYAGE FORCÉ DE L'AUTHENTIFICATION
   * Utile pour les erreurs ou tests
   */
  const clearAuthData = useCallback(() => {
    console.log('🧹 Nettoyage forcé de l\'authentification');
    authService.clearAuthData();
    setUser(null);
  }, []);
  
  /**
   * VÉRIFICATION DE RÔLE
   
  const hasRole = useCallback((role: string): boolean => {
    return user?.roles.includes(role) || false;
  }, [user]);
  
  /**
   * VÉRIFICATION DE PERMISSION
   
  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  }, [user]);
  
  /**
   * VÉRIFICATION DE RÔLES (au moins un)
  
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);
  
  /**
   * VÉRIFICATION DE RÔLES (tous)
   
  const hasAllRoles = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    return roles.every(role => user.roles.includes(role));
  }, [user]);
  */
  /**
   * VALEUR DU CONTEXTE
   * Utilisation de useMemo pour éviter les re-rendus inutiles
   */
  const contextValue = useMemo<AuthContextType>(() => ({
    // État
    user,
    isLoading,
    isAuthenticated: !!user,
    
    // Actions
    login,
    logout,
    refreshUser,
    clearAuthData,
    
    /*
    // Utilitaires
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
    */
  }), [
    user,
    isLoading,
    login,
    logout,
    refreshUser,
    clearAuthData,
   /* hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,*/
  ]);
  
  // Rendu du Provider avec la valeur du contexte
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * HOOK PERSONNALISÉ POUR UTILISER LE CONTEXTE
 * 
 * Utilisation dans les composants:
 * const { user, login, logout } = useAuthContext();
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuthContext doit être utilisé à l\'intérieur d\'un AuthProvider. ' +
      'Assurez-vous que votre application est enveloppée par <AuthProvider> dans layout.tsx'
    );
  }
  
  return context;
}

/**
 * HOOK POUR REDIRIGER SI NON AUTHENTIFIÉ
 * 
 * Utilisation dans les pages protégées:
 * useRequireAuth('/login');
 */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();
  
  useEffect(() => {
    // Attendre la fin du chargement
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);
  
  return { isAuthenticated, isLoading };
}

/**
 * HIGHER-ORDER COMPONENT POUR PROTÉGER LES PAGES
 * 
 * Utilisation:
 * export default withAuth(PageComponent);
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuthContext();
    const router = useRouter();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const redirectUrl = `/login?redirect=${encodeURIComponent(currentPath)}`;
        router.push(redirectUrl);
      }
    }, [isAuthenticated, isLoading, router]);
    
    // Pendant le chargement
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      );
    }
    
    // Si non authentifié, ne rien rendre (la redirection s'occupe du reste)
    if (!isAuthenticated) {
      return null;
    }
    
    // Rendre le composant protégé
    return <Component {...props} />;
  };
}

/**
 * HIGHER-ORDER COMPONENT POUR VÉRIFIER LES RÔLES
 * 
 * Utilisation:
 * export default withRole(['ADMIN'])(AdminPage);
 * export default withRole(['ADMIN', 'MANAGER'], false)(ManagerPage); // false = OU logique
 */
export function withRole(requiredRoles: string[], requireAll = true) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function RoleProtectedComponent(props: P) {
      const { user, isAuthenticated, isLoading } = useAuthContext();
      
      if (isLoading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        );
      }
      
      if (!isAuthenticated || !user) {
        return null; // Redirection gérée par withAuth
      }
     /* 
      // Vérification des rôles
      const hasAccess = requireAll
        ? requiredRoles.every(role => user.roles.includes(role))
        : requiredRoles.some(role => user.roles.includes(role));
      
      if (!hasAccess) {
        return (
          <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Accès non autorisé
              </h2>
              <p className="text-gray-600 mb-4">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </p>
              <p className="text-sm text-gray-500">
                Rôles requis: {requiredRoles.join(requireAll ? ' ET ' : ' OU ')}
                <br />
                Vos rôles: {user.roles.join(', ')}
              </p>
              <button
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Retour
              </button>
            </div>
          </div>
        );
      }*/
      
      return <Component {...props} />;
    };
  };
}
  