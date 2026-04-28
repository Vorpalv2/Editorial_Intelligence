"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HelpCircle, Eye, EyeOff, ArrowRight } from "lucide-react";
import { LoginMotion } from "@/helpers/Motion";
import { useAuth, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { prisma } from "@/src/prisma";

type LoginType = {
  isOnLogin: boolean;
  setIsOnLogin: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login() {
  const [isOnLogin, setIsOnLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="text-on-surface font-headline font-extrabold tracking-tight text-lg">
            Editorial Intelligence
          </div>
          <div className="flex items-center gap-4">
            <button className="text-outline hover:text-primary transition-colors">
              <HelpCircle size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-16 px-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
          {/* Left Side: Editorial Content */}
          <LoginMotion
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden md:flex flex-col flex-1 text-left space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-[0.05rem] uppercase rounded-full">
                Curated Intelligence
              </span>
              <h1 className="font-headline font-extrabold text-5xl lg:text-6xl text-on-surface tracking-tighter leading-tight">
                Deep context for <br /> modern minds.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                Join an exclusive network of curators, analysts, and leaders who
                transform raw information into strategic wisdom.
              </p>
            </div>

            {/* Quote Block */}
            <div className="p-8 bg-surface-container-low rounded-xl border-l-4 border-primary shadow-sm">
              <p className="font-headline italic text-xl text-on-surface leading-snug">
                "The best way to predict the future is to summarize the present
                with surgical precision."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden">
                  <img
                    alt="Elena Vance"
                    className="w-full h-full object-cover"
                    src="https://picsum.photos/seed/elena/100/100"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">
                    Elena Vance
                  </p>
                  <p className="text-xs text-outline">
                    Chief Editorial Officer
                  </p>
                </div>
              </div>
            </div>
          </LoginMotion>

          {/* Right Side: Sign In Form */}
          <div className="relative w-full md:w-[420px] [perspective:1000px]">
            <AnimatePresence mode="wait">
              {isOnLogin ? (
                <LoginComponent
                  key="login-form"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isOnLogin={isOnLogin}
                  setIsOnLogin={setIsOnLogin}
                />
              ) : (
                <RegisterComponent
                  key="register-form"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  isOnLogin={isOnLogin}
                  setIsOnLogin={setIsOnLogin}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed top-1/4 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-1/4 -right-12 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl -z-10"></div>

      {/* Footer */}
      <footer className="w-full py-6 px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[9px] font-bold text-outline/50 uppercase tracking-[0.2em]">
          © 2024 Editorial Intelligence Global
        </div>
        <div className="flex gap-6">
          <a
            className="text-[9px] font-bold text-outline hover:text-primary uppercase tracking-[0.2em] transition-colors"
            href="#"
          >
            Terms
          </a>
          <a
            className="text-[9px] font-bold text-outline hover:text-primary uppercase tracking-[0.2em] transition-colors"
            href="#"
          >
            Privacy
          </a>
        </div>
      </footer>
    </div>
  );
}

function LoginComponent({
  showPassword,
  setShowPassword,
  isOnLogin,
  setIsOnLogin,
}: LoginType) {
  const { signIn, errors } = useSignIn();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!signIn) return;

    const formdata = new FormData(e.currentTarget);

    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    try {
      await signIn.password({ password, emailAddress: email });
    } catch (err: any) {
      console.error("Signup Error:", JSON.stringify(err, null, 2));
    }

    if (signIn.status == "complete") {
      await signIn.finalize({
        navigate: (params) => {
          const url = params.decorateUrl("/history");
          // window.location.href = url;
          router.push(url);
        },
      });
    }
  };

  return (
    <LoginMotion
      // Overriding your defaults for the spin effect
      initial={{ opacity: 1, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 1, rotateY: 180 }}
      transition={{
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
      }}
      // backfaceVisibility prevents seeing the "back" of the div mid-spin
      style={{ backfaceVisibility: "hidden" }}
      className="w-full md:w-[420px] bg-surface-container-lowest p-8 lg:p-10 rounded-xl shadow-xl shadow-on-surface/5 border border-outline-variant/15"
    >
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">
          Welcome back
        </h2>
        <p className="text-on-surface-variant text-sm">
          Please enter your details to sign in.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Address */}
        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline px-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative group">
            <input
              className="w-full h-12 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline"
              htmlFor="password"
            >
              Password
            </label>
            <a
              className="text-[10px] font-bold text-primary hover:underline uppercase tracking-[0.05rem]"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative group">
            <input
              className="w-full h-12 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-outline transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.5} />
              ) : (
                <Eye size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full h-12 micro-gradient text-on-primary font-semibold rounded-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
          type="submit"
        >
          Sign In
          <ArrowRight size={16} />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-[1px] bg-outline-variant/15"></div>
          <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 h-[1px] bg-outline-variant/15"></div>
        </div>

        {/* Social Login */}
        <button
          className="w-full h-12 border border-outline-variant/30 flex items-center justify-center gap-3 bg-surface hover:bg-surface-container-low transition-colors rounded-lg"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          <span className="text-sm font-semibold text-on-surface">
            Continue with Google
          </span>
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant">
          Don't have an account?
          <a
            onClick={() => setIsOnLogin(false)}
            className="text-primary font-bold hover:underline ml-1"
            href="#"
          >
            Create Account
          </a>
        </p>
      </div>
    </LoginMotion>
  );
}

function RegisterComponent({
  showPassword,
  setShowPassword,
  setIsOnLogin,
}: LoginType) {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const { isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    code: "",
  });

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the 'client_state_invalid' error
    if (!signUp) return;

    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    try {
      // Standardized create method
      await signUp.create({
        emailAddress,
        password,
        username, // Dashboard toggle must be ON
      });

      // Send the code
      await signUp.verifications.sendEmailCode();

      // UI state change is handled by Clerk's internal status update
    } catch (err: any) {
      console.error("Signup Error:", JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop the reload that breaks the 'client state'

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === "complete") {
        // Finalize will now work because preventDefault() kept the state alive
        await signUp.finalize({
          navigate: (opts) => {
            const url = opts.decorateUrl("/");
            window.location.href = url;
          },
        });
      }
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <>
        <h1>Verify your account</h1>
        <form onSubmit={handleVerify}>
          <div className="relative-group mb-10 text-center md:text-left">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline"
              htmlFor="code"
            >
              Code
            </label>
            <input
              className="w-full h-12 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="code"
              name="code"
              type="text"
            />
          </div>
          {errors.fields.code && <p>{errors.fields.code.message}</p>}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-outline transition-colors"
            type="submit"
            disabled={fetchStatus === "fetching"}
          >
            Verify
          </button>
        </form>
        <div>
          <button
            className="flex text-outline/40 hover:text-outline transition-colors"
            onClick={() => signUp.verifications.sendEmailCode()}
          >
            I need a new code
          </button>
        </div>
      </>
    );
  }

  return (
    <LoginMotion
      // Overriding your defaults for the spin effect
      initial={{ opacity: 0, rotateY: -180 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 180 }}
      transition={{
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
      }}
      // backfaceVisibility prevents seeing the "back" of the div mid-spin
      style={{ backfaceVisibility: "hidden" }}
      className="w-full md:w-[420px] bg-surface-container-lowest p-8 lg:p-10 rounded-xl shadow-xl shadow-on-surface/5 border border-outline-variant/15"
    >
      <div className="mb-10 text-center md:text-left">
        <h2 className="font-headline font-bold text-2xl text-on-surface mb-2">
          Register Here
        </h2>
      </div>

      <form
        className="space-y-6"
        // onSubmit={(e) => e.preventDefault()}
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline px-1"
            htmlFor="email"
          >
            Username
          </label>
          <div className="relative group">
            <input
              className="w-full h-12 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="username"
              name="username"
              placeholder="*****"
              type="text"
            />
          </div>
          {errors.fields.username && <p>{errors.fields.username.message}</p>}
        </div>
        {/* Email Address */}
        <div className="space-y-2">
          <label
            className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline px-1"
            htmlFor="email"
          >
            Email Address
          </label>
          <div className="relative group">
            <input
              className="w-full h-12 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="email"
              name="email"
              placeholder="name@company.com"
              type="email"
            />
          </div>
          {errors.fields.emailAddress && (
            <p>{errors.fields.emailAddress.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline"
              htmlFor="password"
            >
              Password
            </label>
          </div>
          <div className="relative group">
            <input
              className="w-full h-12 mb-2 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="password"
              name="password"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
            />
            {errors.fields.password && <p>{errors.fields.password.message}</p>}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-outline transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.5} />
              ) : (
                <Eye size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
          <div className="relative group">
            <label
              className="text-[10px] font-bold uppercase tracking-[0.05rem] text-outline"
              htmlFor="reenter password"
            >
              Reenter Password
            </label>
            <input
              className="w-full h-12 mb-2 bg-surface-container-high border-none rounded-lg px-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
              id="passwordCheck"
              name="passwordCheck"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
            />
            {errors.fields.password && <p>{errors.fields.password.message}</p>}

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-outline/40 hover:text-outline transition-colors"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.5} />
              ) : (
                <Eye size={18} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="w-full h-12 micro-gradient text-on-primary font-semibold rounded-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
          type="submit"
        >
          Register
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-on-surface-variant">
          Already have an account?
          <a
            onClick={() => setIsOnLogin(true)}
            className="text-primary font-bold hover:underline ml-1"
            href="#"
          >
            Login
          </a>
        </p>
      </div>
      <div id="clerk-captcha" />
    </LoginMotion>
  );
}
