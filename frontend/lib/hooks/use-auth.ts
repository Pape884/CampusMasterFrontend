import { authService } from "../api/services/auth.service";

export function useAuth() {
  return {
    isAuthenticated: () => authService.isAuthenticated(),
    getUser: () => authService.getCachedUser(),
    getToken: () => authService.getToken(),

    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    register: authService.register.bind(authService),

    refreshToken: authService.refreshToken.bind(authService),
    getCurrentUser: authService.getCurrentUser.bind(authService),

    //hasRole: authService.hasRole.bind(authService),
    //hasPermission: authService.hasPermission.bind(authService),

    clearCache: () => authService.clearAllCache(),
    stopAutoRefresh: () => authService.stopAutoRefresh(),
  };
}
