import { redirect } from "next/navigation";
import { isAuthenticated } from "@/api/common/is-authenticated";
import { LoginForm } from "@/components/login-form/login-form";

export default async function LoginPage() {
  const shouldRedirect = await isAuthenticated();

  if (shouldRedirect) {
    redirect("/dashboard", "replace");
  }

  return (
    <main
      className="ltr h-screen w-full flex items-center justify-center"
      dir="ltr"
    >
      <div className="w-full max-w-105">
        <LoginForm />
      </div>
    </main>
  );
}
