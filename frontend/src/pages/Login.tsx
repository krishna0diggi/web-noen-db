import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { Lock, Scissors } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ROLES } from "@/models/role";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForgotPasswordProps {
  phone?: string;
}

const Login: React.FC<ForgotPasswordProps> = ({ phone }) => {
  const navigate = useNavigate();
  const { login, user, isLoading, error } = useAuth();
  const [form, setForm] = useState({ phone: phone || "", password: "" });

  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
    if (isAuthenticated) {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

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
        (err &&
          err.response &&
          err.response.data &&
          err.response.data.message) ||
        (typeof err === "string" ? err : null) ||
        error ||
        "Login failed. Please check your credentials.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image/Photo */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 items-center justify-center">
        <img
          src="/login-banner.svg" // replace with your image
          alt="Welcome"
          className="max-w-md w-full h-auto object-contain"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md h-full md:h-auto flex flex-col justify-center">
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

          <CardContent className="flex-1 flex items-center">
            <form
              onSubmit={handleSubmit}
              className="bg-card p-8 rounded-3xl shadow-xl w-full"
            >
              <div className="flex justify-center mb-4">
                <Lock className="text-primary w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-4 text-primary">
                Welcome Back!
              </h2>

              {error && (
                <div className="mb-4 text-center text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="mb-4">
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

              <div className="mb-6">
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
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className="mt-6 text-center text-sm text-muted-foreground space-y-2">
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

              <div className="mt-4 text-center">
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
      </div>
    </div>
  );
};

export default Login;
