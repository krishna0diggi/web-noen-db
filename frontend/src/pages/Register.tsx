import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Label from "@radix-ui/react-label";
import { UserPlus } from "lucide-react";

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
    role_id: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form:", form);
    // Call your API here
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <div className="flex justify-center mb-4">
          <UserPlus className="text-green-600 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4 text-green-600">
          Register
        </h2>

        <div className="mb-3">
          <Label.Root htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </Label.Root>
          <input
            id="name"
            type="text"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <Label.Root htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </Label.Root>
          <input
            id="phone"
            type="tel"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <Label.Root htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label.Root>
          <input
            id="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
          />
        </div>

        {/* <div className="mb-6">
          <Label.Root htmlFor="role_id" className="block text-sm font-medium mb-1">
            Role ID
          </Label.Root>
          <input
            id="role_id"
            type="number"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          />
        </div> */}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
