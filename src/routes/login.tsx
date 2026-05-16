import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SplashLogo } from "@/components/SplashLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authStore, isValidUSN, parseUSN, type Role } from "@/lib/auth-store";
import { toast } from "sonner";
import { Fingerprint, Mail, Phone, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — MIT Thandavapura" },
      { name: "description", content: "Authorized sign-in for MIT Thandavapura students, teachers and admins." },
    ],
  }),
});

function LoginPage() {
  return (
    <main className="min-h-screen bg-background grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: "radial-gradient(circle at 30% 30%, var(--brand-orange), transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <SplashLogo size="sm" />
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Authorized access only.</h2>
          <p className="mt-3 text-muted-foreground">
            Real-time bus tracking, college updates, calendars and exam schedules — all in one place.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            Secured with OTP & biometric verification
          </div>
        </div>
        <div className="relative z-10 text-xs text-muted-foreground">© MIT Thandavapura</div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center"><SplashLogo size="sm" /></div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose your role to continue.</p>

          <Tabs defaultValue="student" className="mt-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="admin">Admin / Owner</TabsTrigger>
            </TabsList>
            <TabsContent value="student"><StudentLogin /></TabsContent>
            <TabsContent value="teacher"><TeacherLogin /></TabsContent>
            <TabsContent value="admin"><AdminLogin /></TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" className="w-full" onClick={onClick}>
      <svg className="size-4 mr-2" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2C41.9 35.5 44 30.1 44 24c0-1.2-.1-2.3-.4-3.5z"/>
      </svg>
      Continue with Google
    </Button>
  );
}

function StudentLogin() {
  const navigate = useNavigate();
  const [usn, setUsn] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otp, setOtp] = useState("");

  function sendOtp() {
    if (!isValidUSN(usn)) {
      toast.error("USN must start with 4MN (e.g. 4MN22CS001).");
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    toast.success(`OTP sent to your linked phone. (Demo OTP: ${code})`);
  }

  function verify() {
    if (otp !== generatedOtp) return toast.error("Incorrect OTP.");
    const parsed = parseUSN(usn)!;
    authStore.set({
      id: usn.toUpperCase(),
      name: `Student ${usn.toUpperCase().slice(-3)}`,
      usn: usn.toUpperCase(),
      role: "student",
      year: parsed.year,
      branch: parsed.branch,
    });
    navigate({ to: "/app/travel" });
  }

  function googleSignIn() {
    // Demo: bind Google to a sample USN
    authStore.set({
      id: "4MN22CS001",
      name: "Google Student",
      usn: "4MN22CS001",
      email: "student@mit-thandavapura.edu",
      role: "student",
      year: 3,
      branch: "CS",
    });
    toast.success("Signed in with Google (demo).");
    navigate({ to: "/app/travel" });
  }

  return (
    <div className="space-y-4 mt-4">
      <GoogleButton onClick={googleSignIn} />
      <div className="relative text-center text-xs text-muted-foreground">
        <span className="bg-background px-2 relative z-10">or sign in with USN</span>
        <div className="absolute inset-x-0 top-1/2 h-px bg-border -z-0" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="usn">USN</Label>
        <Input id="usn" placeholder="4MN22CS001" value={usn} onChange={(e) => setUsn(e.target.value)} autoCapitalize="characters" />
      </div>
      {!otpSent ? (
        <Button className="w-full" onClick={sendOtp}>
          <Phone className="size-4 mr-2" /> Send OTP to linked phone
        </Button>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="otp">4-digit OTP</Label>
            <Input id="otp" inputMode="numeric" maxLength={4} placeholder="••••" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} />
          </div>
          <Button className="w-full" onClick={verify}>Verify & sign in</Button>
          <button className="text-xs text-muted-foreground hover:text-foreground" onClick={sendOtp}>Resend OTP</button>
        </>
      )}
    </div>
  );
}

function TeacherLogin() {
  const navigate = useNavigate();
  const [empId, setEmpId] = useState("");

  function loginBio(role: Role = "teacher") {
    if (!empId.trim()) return toast.error("Enter your employee ID.");
    toast.success("Biometric verified (demo).");
    authStore.set({
      id: empId.toUpperCase(),
      name: `Teacher ${empId}`,
      role,
    });
    navigate({ to: "/app/travel" });
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="emp">Employee ID</Label>
        <Input id="emp" placeholder="MIT-T-1024" value={empId} onChange={(e) => setEmpId(e.target.value)} />
      </div>
      <Button className="w-full" onClick={() => loginBio("teacher")}>
        <Fingerprint className="size-4 mr-2" /> Authenticate with biometric
      </Button>
      <p className="text-xs text-muted-foreground">
        Adding new teachers requires biometric approval from the owner.
      </p>
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  function login(role: Role) {
    if (!email.trim()) return toast.error("Enter your email.");
    authStore.set({ id: email, email, name: role === "owner" ? "Owner" : "Admin", role });
    toast.success(`Signed in as ${role}.`);
    navigate({ to: "/app/travel" });
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@mit-thandavapura.edu" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => login("admin")}>
          <Mail className="size-4 mr-2" /> Admin
        </Button>
        <Button onClick={() => login("owner")}>
          <ShieldCheck className="size-4 mr-2" /> Owner (biometric)
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Owner unlocks GPS settings and teacher approvals.
      </p>
    </div>
  );
}