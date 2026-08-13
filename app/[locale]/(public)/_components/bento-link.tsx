import Link from "next/link";
import { CardWrapper } from "@/components/shared/card-wrapper";

export function BentoLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={className}>
      <CardWrapper interactive={true}>{children}</CardWrapper>
    </Link>
  );
}
