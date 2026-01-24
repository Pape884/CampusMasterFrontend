"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "../../components//login/login-form"
import { BookOpen, GraduationCap, Sparkles } from "lucide-react"
import { useAuthContext } from "@/context/authContext";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Redirection si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      redirect('/dashboard');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full">
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(13, 141, 221, 0.1),transparent_50%)]" />
        <div className="relative z-10 max-w-md text-white">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap className="h-10 w-10" />
            <h1 className="text-3xl font-bold">CAMPUS MASTER</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-balance leading-tight">
            Apprenez plus intelligemment, pas plus dur
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Rejoignez des milliers d'étudiants qui transforment leur façon d'apprendre avec nos outils innovants et
            notre communauté engagée.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2 mt-1">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Ressources illimitées</h3>
                <p className="text-white/80 text-sm">Accédez à une bibliothèque complète de cours et exercices</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-white/20 rounded-lg p-2 mt-1">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Suivi personnalisé</h3>
                <p className="text-white/80 text-sm">Suivez vos progrès et recevez des recommandations adaptées</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Campus Master</h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
