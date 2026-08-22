import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form/login-form";
import { requestContextService } from "@/services/helpers/request-context.service";

export default async function LoginPage() {
  const requestContext = await requestContextService.create(
    undefined,
    undefined,
    false,
  );

  if (requestContext.isAuthenticated) {
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
