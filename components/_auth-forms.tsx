"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ZodType } from "zod";
import { Eye, EyeOff, Mail, Phone, User, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

interface AuthFromProps<T extends FieldValues> {
  defaultValues: T;
  type: "Sign_In" | "Sign_Up";
  schema: ZodType<T>;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
}

const AuthForms = <T extends FieldValues>({
  defaultValues,
  type,
  schema,
  onSubmit,
}: AuthFromProps<T>) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState<
    Record<string, boolean>
  >({});

  const isSignIn = type === "Sign_In";

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const payload = {
      fullName: data.fullName || "",
      email: data.email || "",
      phone: data.phone || "",
      password: data.password || "",
    };
    const result = await onSubmit(payload as any);

    if (result.success) {
      toast(
        isSignIn ? "Signed in successfully!" : "Account created successfully!",
        {
          icon: "✅",
          duration: 3000,
        }
      );

      form.reset();
      router.push("/");
    } else {
      toast.error(result.error || "Something went wrong. Please try again.", {
        duration: 3000,
      });
    }
  };

  const getFieldIcon = (key: string) => {
    switch (key.toLowerCase()) {
      case "email":
        return <Mail className="h-4 w-4 text-white/60" />;
      case "phone":
        return <Phone className="h-4 w-4 text-white/60" />;
      case "password":
      case "confirmpassword":
        return <Lock className="h-4 w-4 text-white/60" />;
      default:
        return <User className="h-4 w-4 text-white/60" />;
    }
  };

  const getFieldLabel = (key: string) => {
    const labels: Record<string, string> = {
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      phone: "Phone Number",
      name: "Full Name",
      firstName: "First Name",
      lastName: "Last Name",
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Form Container */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="relative">
          {/* Background with glassmorphism */}
          <div className="absolute inset-0 backdrop-blur-xl rounded-2xl from-orange-500/20 to-pink-500/20 border-orange-500/50 border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5 rounded-2xl"></div>
          </div>

          {/* Form Content */}
          <div className="relative z-10 p-6 md:p-8">
            <div className="space-y-6">
              {Object.keys(defaultValues).map((key) => {
                const isPasswordField =
                  key === "password" || key === "confirmPassword";
                const error = form.formState.errors[key];

                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-white/90">
                      {getFieldLabel(key)}
                    </label>

                    <div className="relative group">
                      {/* Input container with enhanced styling */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl group-focus-within:from-orange-500/10 group-focus-within:to-pink-500/10 transition-all duration-300"></div>
                        <div className="relative bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl group-focus-within:border-orange-500/50 transition-all duration-300">
                          {/* Icon */}
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                            {getFieldIcon(key)}
                          </div>

                          {/* Input */}
                          <Input
                            type={
                              isPasswordField && !showPassword[key]
                                ? "password"
                                : key === "phone"
                                ? "tel"
                                : "text"
                            }
                            maxLength={key === "phone" ? 10 : undefined}
                            minLength={key === "phone" ? 10 : undefined}
                            pattern={key === "phone" ? "\\d{10}" : undefined}
                            placeholder={`Enter your ${getFieldLabel(
                              key
                            ).toLowerCase()}`}
                            className={cn(
                              "w-full pl-10 pr-12 py-3 bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0 focus:outline-none",
                              error && "text-red-300"
                            )}
                            {...form.register(key as Path<T>)}
                          />

                          {/* Password toggle */}
                          {isPasswordField && (
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(key)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                            >
                              {showPassword[key] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Error message */}
                      {error && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                          <p className="text-red-400 text-xs">
                            {typeof error.message === "string" && error.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                className="group relative w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 rounded-xl py-3 font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  {form.formState.isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {isSignIn ? "Sign In" : "Create Account"}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </form>
      {/* Footer */}
      <div className="text-center mt-6 p-4">
        <p className="text-white/70 text-sm">
          {isSignIn ? "New to HireHUB?" : "Already have an account?"}{" "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200 hover:underline"
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </Link>
        </p>

        {/* Additional options */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
            Secure & Encrypted
          </div>
          <div className="w-px h-3 bg-white/20"></div>
          <div className="text-xs text-white/50">Trusted by 10K+ HRs</div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute -top-4 right-8 w-2 h-2 bg-orange-400/40 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-4 left-12 w-1 h-1 bg-pink-400/40 rounded-full animate-pulse delay-1000"></div>
    </div>
  );
};

export default AuthForms;
