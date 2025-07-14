import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Lock, Scissors } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ROLES } from "@/models/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

interface ForgotPasswordProps {
  phone?: string;
}

const Login: React.FC<ForgotPasswordProps> = ({ phone }) => {
  const navigate = useNavigate();
  const { login, user, isLoading, error } = useAuth();
  const [form, setForm] = useState({ phone: phone || "", password: "" });

  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case ROLES.ADMIN:
        navigate("/admin");
        break;
      case ROLES.USER:
        navigate("/user");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ phone: form.phone, password: form.password });
      if (!user) return;
      toast.success("Login Successful!");
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMsg =
        err?.response?.data?.message ||
        (typeof err === "string" ? err : null) ||
        error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Scissors className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to LooksNLove
            </CardTitle>
            <p className="text-muted-foreground">Sign in to your account</p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="bg-card p-6 rounded-2xl w-full space-y-4"
            >
              <div className="flex justify-center">
                <Lock className="text-primary w-8 h-8" />
              </div>

              {error && (
                <div className="text-center text-destructive font-medium">
                  {error}
                </div>
              )}

              <div>
                <Label.Root
                  htmlFor="phone"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Phone Number
                </Label.Root>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div>
                <Label.Root
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1"
                >
                  Password
                </Label.Root>
                <input
                  id="password"
                  type="password"
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline block"
                >
                  Forgot Password?
                </Link>
                <span>
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-accent-foreground hover:underline"
                  >
                    Register
                  </Link>
                </span>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
