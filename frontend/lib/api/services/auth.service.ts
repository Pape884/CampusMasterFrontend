'use client';

/**
 * SERVICE D'AUTHENTIFICATION COMPLET
 * 
 * Ce service gère toutes les opérations d'authentification :
 * - Login/Register avec JWT
 * - Gestion des tokens (refresh, expiration)
 * - Cache des données utilisateur
 * - Gestion des permissions/rôles
 * - Intégration avec Spring Boot Security
 */

import { apiClient } from '../axios/client';
import apiClientNoCache from "../axios/client"
import { cacheManager } from '../axios/cache';
import { LoginCredentials, AuthResponse, RefreshTokenResponse, User } from '.';


class AuthService {
    // Chemins de l'API Spring Boot
    private basePath = '/v1/auth';

    // Clés de stockage localStorage
    private tokenKey = 'auth_token';           // Token JWT
    private refreshTokenKey = 'refresh_token'; // Refresh token
    private tokenExpiryKey = 'token_expiry';   // Date d'expiration

    // Clé pour le cache utilisateur
    private userCacheKey = 'current_user';

    // Intervalle de vérification d'expiration (en ms)
    private tokenCheckInterval = 60000; // 1 minute

    // Référence à l'intervalle
    private tokenRefreshInterval: NodeJS.Timeout | null = null;

    /**
     * CONSTRUCTEUR
     */
    constructor() {
        // Initialisation
        this.setupTokenAutoRefresh();
    }

    // ==================== MÉTHODES PUBLIQUES ====================

    /**
     * CONNEXION UTILISATEUR
     * @param credentials - Identifiants de connexion
     * @returns Promise avec les données d'authentification
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            console.log('🔐 Tentative de connexion avec:', credentials);

            // Appel à l'API Spring Boot (POST /auth/login)
            const response = await apiClientNoCache.post<AuthResponse>(
                `${this.basePath}/login`,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Connexion réussie pour:', response.data);

            // Sauvegarde des données d'authentification
            this.setAuthData(response.data);

            // Cache l'utilisateur
            this.setUserCache(response.data.data.user);

            return response.data;

        } catch (error: any) {
            console.error('❌ Erreur de connexion:', error);

            // Nettoyage en cas d'erreur
            this.clearAuthData();

            // Gestion spécifique des erreurs
            throw this.handleAuthError(error);
        }
    }

    /**
     * INSCRIPTION UTILISATEUR
     * @param data - Données d'inscription
     * @returns Promise avec les données d'authentification
     */
    /*async register(data: RegisterData): Promise<AuthResponse> {
        try {
            console.log('📝 Tentative d\'inscription pour:', data.email);

            // Validation des mots de passe
            if (data.password !== data.confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            // Appel à l'API Spring Boot (POST /auth/register)
            const response = await apiClientNoCache.post<AuthResponse>(
                `${this.basePath}/register`,
                {
                    email: data.email,
                    password: data.password,
                    firstName: data.firstName,
                    lastName: data.lastName,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Inscription réussie pour:', response.data.data.user.email);

            // Sauvegarde des données
            this.setAuthData(response.data);
            this.setUserCache(response.data.data.user);

            return response.data;

        } catch (error: any) {
            console.error('❌ Erreur d\'inscription:', error);
            this.clearAuthData();
            throw this.handleAuthError(error);
        }
    }

    /**
     * DÉCONNEXION UTILISATEUR
     * @returns Promise vide
     */
    async logout(): Promise<void> {
        try {
            console.log('👋 Déconnexion en cours...');

            // Récupération du token avant nettoyage
            const token = this.getToken();

            // Si token existe, notifier le serveur Spring Boot
            if (token) {
                await apiClientNoCache.post(
                    `${this.basePath}/logout`,
                    {}, // Corps vide
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                console.log('✅ Serveur notifié de la déconnexion');
            }

        } catch (error) {
            // Même si l'API échoue, on nettoie côté client
            console.warn('⚠️ Déconnexion API échouée, nettoyage local:', error);

        } finally {
            // TOUJOURS nettoyer les données locales
            this.clearAuthData();
            this.clearUserCache();
            this.clearAllCache();

            console.log('✅ Déconnexion complète');
        }
    }

    /**
     * RAFRAÎCHISSEMENT DU TOKEN
     * @returns Promise avec les nouveaux tokens
     */
    async refreshToken(): Promise<RefreshTokenResponse> {
        const refreshToken = this.getRefreshToken();

        if (!refreshToken) {
            throw new Error('Aucun refresh token disponible');
        }

        try {
            console.log('🔄 Rafraîchissement du token...');

            // Appel à l'API Spring Boot (POST /auth/refresh)
            const response = await apiClientNoCache.post<RefreshTokenResponse>(
                `${this.basePath}/refresh`,
                {
                    refresh_token: refreshToken,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Token rafraîchi avec succès');

            // Mise à jour des tokens
            this.setToken(response.data.access_token, response.data.expires_in);

            if (response.data.refresh_token) {
                this.setRefreshToken(response.data.refresh_token);
            }

            return response.data;

        } catch (error: any) {
            console.error('❌ Erreur de rafraîchissement:', error);

            // En cas d'erreur, déconnecter l'utilisateur
            this.clearAuthData();
            throw error;
        }
    }

    /**
     * RÉCUPÉRATION DE L'UTILISATEUR COURANT
     * @param forceRefresh - Force le rechargement depuis l'API
     * @returns Promise avec les données utilisateur ou null
     */
    async getCurrentUser(forceRefresh = false): Promise<User | null> {
        // ÉTAPE 1: Vérifier le cache d'abord (si pas forcé)
        if (!forceRefresh) {
            const cachedUser = this.getCachedUser();
            if (cachedUser) {
                console.log('📦 Utilisateur récupéré du cache');
                return cachedUser;
            }
        }

        // ÉTAPE 2: Vérifier si un token existe
        const token = this.getToken();
        if (!token) {
            console.log('⚠️ Aucun token, utilisateur non connecté');
            return null;
        }

        try {
            console.log('👤 Chargement de l\'utilisateur depuis l\'API...');

            // Appel à l'API Spring Boot (GET /auth/me)
            const response = await apiClient.get<{ user: User }>(
                `users/me`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const user = response.data.user;
            console.log('✅ Utilisateur chargé:', user.email);

            // Mise en cache
            this.setUserCache(user);

            return user;

        } catch (error: any) {
            // Gestion spécifique des erreurs 401 (token expiré)
            if (error.response?.status === 401) {
                console.log('🔄 Token expiré, tentative de rafraîchissement...');

                try {
                    // Tenter de rafraîchir le token
                    await this.refreshToken();

                    // Rappeler la fonction après rafraîchissement
                    return this.getCurrentUser(true);

                } catch (refreshError) {
                    console.error('❌ Échec du rafraîchissement:', refreshError);
                    this.clearAuthData();
                    return null;
                }
            }

            console.error('❌ Erreur de chargement utilisateur:', error);
            return null;
        }
    }

    /**
     * DEMANDE DE RÉINITIALISATION DE MOT DE PASSE
     * @param email - Email de l'utilisateur
     */
    async requestPasswordReset(email: string): Promise<void> {
        try {
            await apiClientNoCache.post(
                `${this.basePath}/password/request-reset`,
                { email },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('✅ Demande de réinitialisation envoyée à:', email);
        } catch (error) {
            console.error('❌ Erreur demande réinitialisation:', error);
            throw error;
        }
    }

    /**
     * RÉINITIALISATION DU MOT DE PASSE
     * @param token - Token de réinitialisation
     * @param newPassword - Nouveau mot de passe
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await apiClientNoCache.post(
                `${this.basePath}/password/reset`,
                { token, newPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('✅ Mot de passe réinitialisé');
        } catch (error) {
            console.error('❌ Erreur réinitialisation mot de passe:', error);
            throw error;
        }
    }

    /**
     * CHANGEMENT DE MOT DE PASSE
     * @param currentPassword - Mot de passe actuel
     * @param newPassword - Nouveau mot de passe
     */
    async changePassword(currentPassword: string, newPassword: string): Promise<void> {
        try {
            const token = this.getToken();

            if (!token) {
                throw new Error('Utilisateur non authentifié');
            }

            await apiClient.post(
                `${this.basePath}/password/change`,
                { currentPassword, newPassword },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Mot de passe changé avec succès');
        } catch (error) {
            console.error('❌ Erreur changement mot de passe:', error);
            throw error;
        }
    }

    // ==================== VÉRIFICATIONS ====================

    /**
     * VÉRIFIE SI L'UTILISATEUR EST AUTHENTIFIÉ
     * @returns boolean - true si authentifié
     */
    isAuthenticated(): boolean {
        // Vérifier si un token existe
        const token = this.getToken();
        if (!token) {
            return false;
        }

        // Vérifier l'expiration du token
        const expiry = this.getTokenExpiry();
        if (expiry && Date.now() >= expiry) {
            console.log('⌛ Token expiré');
            this.clearToken();
            return false;
        }

        return true;
    }

    /**
     * VÉRIFIE SI LE TOKEN EXPIRE BIENTÔT
     * @param minutes - Nombre de minutes avant expiration
     * @returns boolean - true si expire bientôt
     */
    isTokenExpiringSoon(minutes = 5): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return false;

        const now = Date.now();
        const threshold = minutes * 60 * 1000; // Conversion minutes -> ms

        return expiry - now <= threshold;
    }


    // ==================== MÉTHODES DE STOCKAGE ====================

    /**
     * SAUVEGARDE LES DONNÉES D'AUTHENTIFICATION
     * @param authData - Données d'authentification
     */
    private setAuthData(authData: AuthResponse): void {
        // Sauvegarde du token principal
        this.setToken(authData.data.token,86400000);

        // Sauvegarde du refresh token (si présent)
        if (authData.data.refreshToken) {
            this.setRefreshToken(authData.data.refreshToken);
        }

        // Cache de l'utilisateur
        this.setUserCache(authData.data.user);

        console.log('💾 Données d\'authentification sauvegardées');
    }

    /**
     * SAUVEGARDE LE TOKEN D'ACCÈS
     * @param token - Token JWT
     * @param expiresIn - Durée de validité en secondes
     */
    private setToken(token: string, expiresIn: number): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(this.tokenKey, token);

        // Calcul de la date d'expiration
        const expiry = Date.now() + (expiresIn * 1000);
        localStorage.setItem(this.tokenExpiryKey, expiry.toString());

        console.log('💾 Token sauvegardé, expire dans', expiresIn, 'secondes');
    }

    /**
     * SAUVEGARDE LE REFRESH TOKEN
     * @param token - Refresh token
     */
    private setRefreshToken(token: string): void {
        if (typeof window === 'undefined') return;

        localStorage.setItem(this.refreshTokenKey, token);
        console.log('💾 Refresh token sauvegardé');
    }

    /**
     * SAUVEGARDE L'UTILISATEUR DANS LE CACHE
     * @param user - Données utilisateur
     */
    private setUserCache(user: User): void {
        // Cache pour 30 minutes
        cacheManager.set(this.userCacheKey, user, 30 * 60 * 1000);
        console.log('💾 Utilisateur mis en cache');
    }

    /**
     * RÉCUPÈRE LE TOKEN D'ACCÈS
     * @returns string | null - Token ou null
     */
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * RÉCUPÈRE LE REFRESH TOKEN
     * @returns string | null - Refresh token ou null
     */
    getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.refreshTokenKey);
    }

    /**
     * RÉCUPÈRE LA DATE D'EXPIRATION DU TOKEN
     * @returns number | null - Timestamp d'expiration
     */
    getTokenExpiry(): number | null {
        if (typeof window === 'undefined') return null;

        const expiry = localStorage.getItem(this.tokenExpiryKey);
        return expiry ? parseInt(expiry) : null;
    }

    /**
     * RÉCUPÈRE L'UTILISATEUR DU CACHE
     * @returns User | null - Utilisateur ou null
     */
    getCachedUser(): User | null {
        return cacheManager.get(this.userCacheKey);
    }

    // ==================== NETTOYAGE ====================

    /**
     * NETTOIE TOUTES LES DONNÉES D'AUTHENTIFICATION
     */
    clearAuthData(): void {
        if (typeof window === 'undefined') return;

        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.tokenExpiryKey);

        this.clearUserCache();

        console.log('🧹 Données d\'authentification nettoyées');
    }

    /**
     * NETTOIE LE CACHE UTILISATEUR
     */
    private clearUserCache(): void {
        cacheManager.delete(this.userCacheKey);
        console.log('🧹 Cache utilisateur nettoyé');
    }

    /**
     * NETTOIE TOUT LE CACHE
     */
    clearAllCache(): void {
        cacheManager.clear();
        console.log('🧹 Tout le cache nettoyé');
    }

    /**
     * NETTOIE SEULEMENT LE TOKEN D'ACCÈS
     */
    private clearToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.tokenKey);
        console.log('🧹 Token d\'accès nettoyé');
    }

    // ==================== GESTION DES ERREURS ====================

    /**
     * GESTIONNAIRE D'ERREURS D'AUTHENTIFICATION
     * @param error - Erreur axios
     * @returns Error - Erreur formatée
     */
    private handleAuthError(error: any): Error {
        // Erreur de réponse API
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    return new Error(data.message || 'Requête invalide');
                case 401:
                    return new Error('Identifiants incorrects');
                case 403:
                    return new Error('Accès non autorisé');
                case 404:
                    return new Error('API non trouvée');
                case 422:
                    // Erreurs de validation Spring Boot
                    const firstError = data.errors?.[0]?.defaultMessage ||
                        data.message ||
                        'Données invalides';
                    return new Error(firstError);
                case 429:
                    return new Error('Trop de tentatives. Veuillez réessayer plus tard');
                case 500:
                    return new Error('Erreur serveur. Veuillez réessayer plus tard');
                default:
                    return new Error(`Erreur ${status}: ${data.message || 'Erreur inconnue'}`);
            }
        }

        // Erreur réseau
        if (error.request) {
            return new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
        }

        // Erreur générale
        return new Error('Une erreur inattendue est survenue');
    }

    // ==================== AUTO-REFRESH ====================

    /**
     * CONFIGURE LE RAFFRAÎCHISSEMENT AUTOMATIQUE DU TOKEN
     */
    private setupTokenAutoRefresh(): void {
        // Nettoyer l'intervalle existant
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        // Créer un nouvel intervalle qui vérifie toutes les minutes
        this.tokenRefreshInterval = setInterval(() => {
            this.checkAndRefreshToken();
        }, this.tokenCheckInterval);

        console.log('🔧 Auto-refresh du token configuré');
    }

    /**
     * VÉRIFIE ET RAFRAÎCHIT LE TOKEN SI NÉCESSAIRE
     */
    private async checkAndRefreshToken(): Promise<void> {
        if (this.isTokenExpiringSoon(5)) { // 5 minutes avant expiration
            console.log('🔄 Token expire bientôt, rafraîchissement automatique...');

            try {
                await this.refreshToken();
                console.log('✅ Token rafraîchi automatiquement');
            } catch (error) {
                console.error('❌ Échec du rafraîchissement automatique:', error);
            }
        }
    }

    /**
     * ARRÊTE LE RAFFRAÎCHISSEMENT AUTOMATIQUE
     */
    stopAutoRefresh(): void {
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
            this.tokenRefreshInterval = null;
            console.log('🛑 Auto-refresh arrêté');
        }
    }
}

// ==================== EXPORT SINGLETON ====================

/**
 * Instance unique du service d'authentification
 */
export const authService = new AuthService();

