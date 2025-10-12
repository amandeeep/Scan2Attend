import React, { useState, useRef, useEffect } from "react";
import { Croissant } from "lucide-react";
import img from "../Images/ForgotPassword.png";
import { Link } from "react-router-dom";

const OtpPage = () => {
  const length = 3; // OTP length
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60); // resend cooldown
  const inputsRef = useRef([]);

  // Countdown logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleChange = (val, index) => {
    if (/^[0-9]?$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < length - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== length) {
      setError("Please enter complete OTP.");
      return;
    }
    // Replace with backend API verification
    setError("✅ OTP Verified Successfully");
  };

  const handleResend = () => {
    // Call backend API to resend OTP
    setOtp(Array(length).fill(""));
    setTimeLeft(60);
    setError("📩 New OTP has been sent!");
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        
        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col">
          {/* Logo */}
          <div className="mb-6 flex items-center gap-2">
            <Croissant className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Scan2Attend
            </span>
          </div>

          {/* Error / Success */}
          {error && (
            <div className={`alert ${error.includes("✅") ? "alert-success" : "alert-info"} mb-4`}>
              {error}
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <h2 className="text-xl font-semibold">Enter OTP</h2>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center input input-bordered"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button type="submit" className="btn btn-primary w-full">
              Verify OTP
            </button>

            {/* Resend OTP Section */}
            <div className="text-center mt-4">
              <Link to='/login/reset-password'>@</Link>
              {timeLeft > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend OTP in <span className="font-semibold">{timeLeft}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  className="btn btn-link text-primary"
                  onClick={handleResend}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Left Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src={img} alt="OTP Verification" className="w-full h-full" />
            </div>
            <div className="text-center mt-6 space-y-3">
              <h2 className="text-xl font-semibold">OTP Verification</h2>
              <p className="text-gray-600 text-sm">
                Enter the {length}-digit OTP sent to your email / phone
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OtpPage;
