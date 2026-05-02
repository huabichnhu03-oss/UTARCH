import { useState } from "react";
import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const login = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          if (data.authenticated) {
            setLocation("/admin");
            toast({ title: "Logged in successfully" });
          } else {
            toast({ title: "Invalid password", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Invalid password", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-background border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-2">ADMIN_ACCESS</h1>
        <p className="text-muted-foreground mb-6 text-sm">Enter password to manage portfolio.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-border rounded-none focus-visible:ring-primary"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full rounded-none font-bold tracking-widest uppercase bg-primary hover:bg-accent text-white" 
            disabled={login.isPending || !password}
          >
            {login.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Authenticate
          </Button>
        </form>
      </div>
    </div>
  );
}
