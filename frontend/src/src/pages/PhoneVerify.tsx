import React, { useEffect, useState } from "react";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import { Link } from "react-router-dom";
import { verifyPhoneNumber } from "@/service/userService/userService";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

declare global {
  interface Window {
    phoneEmailListener?: (userObj: any) => void;
  }
}

type PhoneVerifyProps = {
  isForgot?: boolean;
  isRegister?: boolean;
};

const PhoneVerify: React.FC<PhoneVerifyProps> = ({ isForgot, isRegister }) => {
  const [phone, setPhone] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneExist, setPhoneExist] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const SignInButton = () => {
      const script = document.createElement("script");
      script.src = "https://www.phone.email/sign_in_button_v1.js";
      script.async = true;
      document.body.appendChild(script);

      const phoneEmailListener = async (userObj: any) => {
        const { user_country_code, user_phone_number } = userObj;
        setIsAuthenticated(true);
        setPhone(user_phone_number);
        setIsVerifying(true);

        try {
          const exists = await verifyPhoneNumber(user_phone_number);
          setPhoneExist(exists);
        } catch (err) {
          console.error("Phone verification failed:", err);
          setPhoneExist(false);
        } finally {
          setIsVerifying(false);
        }
      };

      window.phoneEmailListener = phoneEmailListener;

      return () => {
        document.body.removeChild(script);
      };
    };

    SignInButton();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {!isAuthenticated && (
            <div className="bg-white dark:bg-boxdark p-8 rounded-xl shadow-lg text-center">
              <h1 className="text-2xl font-bold text-primary mb-2">
                {isForgot
                  ? "Reset Password"
                  : isRegister
                  ? "Register on LooksNLove"
                  : "Welcome to LooksNLove"}
              </h1>
              <p className="text-muted-foreground mb-4">
                Verify your Phone Number
              </p>

              <div
                className="pe_signin_button mb-6"
                data-client-id="12849611767464246249"
              ></div>

              <div className="flex justify-between text-sm text-primary font-medium">
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                {!isForgot && (
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
            </div>
          )}

          {isAuthenticated && isVerifying && (
            <div className="text-center text-primary font-medium">
              Verifying phone number...
            </div>
          )}

          {isAuthenticated && !isVerifying && (
            isForgot ? (
              <ForgotPassword phone={phone} />
            ) : isRegister ? (
              <Register phone={phone} />
            ) : phoneExist ? (
              <Login phone={phone} />
            ) : (
              <Register phone={phone} />
            )
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PhoneVerify;
