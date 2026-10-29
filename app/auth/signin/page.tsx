// app/auth/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import logo from "@/lib/logo.png";
import { MailIcon, LockIcon, AlertCircleIcon } from "@phosphor-icons/react";
import { HeaderNavigation } from "@/components/HeaderNavigation";
import LanguageSwitcher, { type Language } from "@/components/LanguageSwitcher";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const isNepali = language === "np";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setFormError(isNepali ? "गलत इमेल वा पासवर्ड" : "Invalid email or password");
      } else {
        router.push(callbackUrl);
        router.refresh();
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
              {isNepali ? "साइन इन गर्नुहोस्" : "Sign In"}
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              {isNepali
                ? "आफ्नो खाता प्रवेश गर्न इमेल र पासवर्ड प्रविष्ट गर्नुहोस्"
                : "Enter your email and password to access your account"}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {(error || formError) && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertCircleIcon size={16} />
                <span>{formError || (isNepali ? "प्रमाणीकरण असफल" : "Authentication failed")}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder={isNepali ? "तपाईंको पासवर्ड" : "••••••••"}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-2" />
                    {isNepali ? "प्रवेश गर्दै..." : "Signing in..."}
                  </>
                ) : (
                  isNepali ? "साइन इन गर्नुहोस्" : "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {isNepali ? "वा" : "Or"}
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              {isNepali ? "खाता छैन?" : "Don't have an account?"}{" "}
              <Link href={`/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary hover:underline font-medium">
                {isNepali ? "साइन अप गर्नुहोस्" : "Sign Up"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}