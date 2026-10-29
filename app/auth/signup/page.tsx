// app/auth/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import logo from "@/lib/logo.png";
import { MailIcon, LockIcon, UserIcon, AlertCircleIcon, CheckIcon } from "@phosphor-icons/react";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const isNepali = language === "np";

  const validatePassword = (pwd: string) => {
    const checks = [
      { test: pwd.length >= 8, label: isNepali ? "कम्तिमा ८ अक्षर" : "At least 8 characters" },
      { test: /[A-Z]/.test(pwd), label: isNepali ? "एक ठो ठूलो अक्षर" : "One uppercase letter" },
      { test: /[a-z]/.test(pwd), label: isNepali ? "एक ठो सानो अक्षर" : "One lowercase letter" },
      { test: /[0-9]/.test(pwd), label: isNepali ? "एक ठो अंक" : "One number" },
    ];
    return checks;
  };

  const passwordChecks = validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError(isNepali ? "पासवर्ड मिल्दैन" : "Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setFormError(isNepali ? "पासवर्ड कम्तिमा ८ अक्षरको हुनुपर्छ" : "Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || (isNepali ? "दर्ता असफल" : "Registration failed"));
        return;
      }

      // Auto sign in after registration
      const signInRes = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password, callbackUrl }),
      });

      if (signInRes.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
    } catch {
      setFormError(isNepali ? "कुछ गलत भयो। पुनः प्रयास गर्नुहोस्।" : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background font-sans text-foreground" lang={isNepali ? "ne" : "en"}>
      <header className="relative flex h-21.25 items-center justify-between border-b border-b-border px-6 md:px-21">
        <Image src={logo} alt="MeroJyotish" priority className="h-auto w-24 md:w-32" />
        <HeaderNavigation />
        <LanguageSwitcher language={language} onLanguageChange={setLanguage} />
      </header>

      <section className="flex min-h-[calc(100vh-21.25rem)] items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isNepali ? "खाता बनाउनुहोस्" : "Create Account"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isNepali
                ? "आफ्नो जन्म कुण्डली र मिलान सुरक्षित राख्न खाता बनाउनुहोस्"
                : "Create an account to save your birth charts and compatibility reports"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formError && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircleIcon size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">{isNepali ? "नाम (ऐच्छिक)" : "Name (optional)"}</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isNepali ? "तपाईंको नाम" : "Your name"}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">{isNepali ? "इमेल" : "Email"}</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isNepali ? "तपाईंको इमेल" : "your@email.com"}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{isNepali ? "पासवर्ड" : "Password"}</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isNepali ? "पासवर्ड बनाउनुहोस्" : "Create password"}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                {password && (
                  <div className="mt-2 space-y-1">
                    {passwordChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`flex h-4 w-4 items-center justify-center rounded ${check.test ? "text-green-500" : "text-muted-foreground"}`}>
                          {check.test ? <CheckIcon size={12} weight="fill" /> : <span className="text-[10px]">•</span>}
                        </span>
                        <span className={check.test ? "text-green-500" : "text-muted-foreground"}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">{isNepali ? "पासवर्ड पुष्टि गर्नुहोस्" : "Confirm Password"}</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isNepali ? "पछाडि पासवर्ड लेख्नुहोस्" : "Confirm password"}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircleIcon size={12} />
                    {isNepali ? "पासवर्ड मिल्दैन" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
                    {isNepali ? "खाता बनाउँदै..." : "Creating account..."}
                  </>
                ) : (
                  isNepali ? "खाता बनाउनुहोस्" : "Create Account"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isNepali ? "पहिले नै खाता छ?" : "Already have an account?"}{" "}
              <Link href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary hover:underline font-medium">
                {isNepali ? "साइन इन गर्नुहोस्" : "Sign In"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}