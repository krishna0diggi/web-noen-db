import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

import LoadingSpinner from "@/components/ui/LoadingSpinner";

type ForgotPasswordProps = {
  phone: string;
};

const Register: React.FC<ForgotPasswordProps> = ({ phone }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    otp: "",
    role_id: 1,
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Animate form on mount
  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your API call
      const payload = {
        ...form,
        otp: Number(form.otp),
        role_id: Number(form.role_id),
      };
      // await api.register(payload);
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 1200);
    } catch (err) {
      setLoading(false);
      // handle error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 dark:bg-[#18181b]">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center w-full h-full py-20"
        >
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md w-full max-w-md border border-border/30 dark:border-border/60"
          initial={{ opacity: 0, y: 40 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex justify-center mb-4">
            <UserPlus className="text-primary dark:text-primary-dark w-10 h-10" />
          </div>
          <h2 className="text-2xl font-semibold text-center mb-4 text-primary dark:text-primary-dark">
            Register
          </h2>
          <div className="mb-3">
            <Label.Root
              htmlFor="name"
              className="block text-sm font-medium mb-1"
            >
              Name
            </Label.Root>
            <input
              id="name"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Label.Root
              htmlFor="phone"
              className="block text-sm font-medium mb-1"
            >
              Phone
            </Label.Root>
            <input
              id="phone"
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Label.Root
              htmlFor="address"
              className="block text-sm font-medium mb-1"
            >
              Address
            </Label.Root>
            <input
              id="address"
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Label.Root
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </Label.Root>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <Label.Root htmlFor="otp" className="block text-sm font-medium mb-1">
              OTP
            </Label.Root>
            <input
              id="otp"
              type="number"
              required
              className="w-full px-3 py-2 border rounded-md bg-background dark:bg-zinc-800 text-foreground"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary dark:bg-primary-dark text-white py-2 rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition"
          >
            Register
          </button>
        </motion.form>
      )}
    </div>
  );
};

export default Register;
