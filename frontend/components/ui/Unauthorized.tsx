import { AlertCircle } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Accès non autorisé
        </h2>
        
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Veuillez vous connecter avec un compte ayant les droits appropriés.
        </p>
        
        <div className="space-y-3">
          <a 
            href="/login" 
            className="block w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            Se connecter
          </a>
          <a 
            href="/" 
            className="block w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}