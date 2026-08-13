import { LoginForm } from "@/components/login-form/login-form";
import { redirect } from "@/i18n/navigation";
import { requestContextService } from "@/services/helpers/request-context.service";

export default async function LoginPage({
  params,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;

  const requestContext = await requestContextService.create(
    undefined,
    undefined,
    false,
  );

  if (requestContext.isAuthenticated) {
    redirect({ href: "/dashboard", locale });
  }

  return (
    <main className="h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-105">
        <LoginForm />
      </div>
    </main>
  );
}
