import type React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from "lucide-react"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-balance">Bienvenue!</CardTitle>
          <CardDescription className="text-base">
            Connectez-vous pour continuer votre parcours d'apprentissage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-5">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="nom@exemple.com" className="pl-10 h-11" required />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">
                    Mot de passe
                  </Label>
                  <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Mot de passe oublié?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type="password" className="pl-10 h-11" required />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md"
              >
                Se connecter
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground"></span>
                </div>
              </div>
            
            </div>
           
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground px-8">
        En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité
      </p>
    </div>
  )
}
