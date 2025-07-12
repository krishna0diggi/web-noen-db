import React, { useEffect, useState } from "react";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import Login from "./Login";
import { Link } from "react-router-dom";
import { verifyPhoneNumber } from "@/service/userService/userService";

declare global {
  interface Window {
    phoneEmailListener?: (userObj: any) => void;
  }
}

type PhoneVerifyProps = {
  isForgot?: boolean;
};

const PhoneVerify: React.FC<PhoneVerifyProps> = ({ isForgot }) => {
  const [phone, setPhone] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneExist, setPhoneExist] = useState(false);

  const [userDetails, setUserDetails] = useState({
    countryCode: "",
    phoneNo: "",
  });

  useEffect(() => {
    const SignInButton = () => {
      const script = document.createElement("script");
      script.src = "https://www.phone.email/sign_in_button_v1.js";
      script.async = true;
      document.body.appendChild(script);

      const phoneEmailListener = async (userObj: any) => {
        const { user_country_code, user_phone_number } = userObj;
        setIsAuthenticated(true);
        setUserDetails({
          countryCode: user_country_code,
          phoneNo: user_phone_number,
        });
        setPhone(user_phone_number);
        // Use the new service
        const exists = await verifyPhoneNumber(user_phone_number);
        console.log(exists);
        
        setPhoneExist(exists);
      };
      window.phoneEmailListener = phoneEmailListener;

      return () => {
        document.body.removeChild(script);
      };
    };
    SignInButton();
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Left Side - Branding Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-8">
        <img
          src={
            isForgot
              ? "https://res.cloudinary.com/dm71xhdxd/image/upload/v1724144120/forgot-password_vycc2l.webp"
              : "https://res.cloudinary.com/dq7vggsop/image/upload/v1719464285/jqz80kzevq3cavjxuork.jpg"
          }
          alt="Illustration"
          className="max-w-md w-full h-auto object-contain rounded-xl shadow-lg"
        />
      </div>

      {/* Right Side - Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        {!isAuthenticated && (
          <div className="bg-white dark:bg-boxdark p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">
              {isForgot ? "Reset Password" : "Welcome to LooksNLove"}
            </h1>
            <p className="text-muted-foreground mb-4">Verify your Phone Number</p>

            <div
              className="pe_signin_button mb-6"
              data-client-id="16031306208315887707"
            ></div>

            <div className="flex justify-between text-sm text-primary font-medium">
              <Link to="/login" className="hover:underline">Login</Link>
              {!isForgot && (
                <Link to="/forgot-password" className="hover:underline">Forgot password?</Link>
              )}
            </div>
          </div>
        )}

        {isAuthenticated && !phoneExist && <Register phone={phone} />}
        {isAuthenticated && phoneExist && (
          isForgot ? <ForgotPassword phone={phone} /> : <Login phone={phone} />
        )}
      </div>
    </div>
  );
};

export default PhoneVerify;
