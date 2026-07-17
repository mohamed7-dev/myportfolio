import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form/login-form";
import { profileService } from "@/services/profile.service";

export default async function LoginPage() {
  const session = await profileService().getSession();

  if (session.profile) {
    redirect("/dashboard");
  }

  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-105">
        <LoginForm />
      </div>
    </main>
  );
}
