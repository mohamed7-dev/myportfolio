import Link from "next/link";
import { Card } from "@/components/ui/card";

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
      <Card className="group h-full overflow-hidden transition-all duration-300 shadow-default hover:shadow-none hover:translate-x-box-shadow-x hover:translate-y-box-shadow-y">
        {children}
      </Card>
    </Link>
  );
}
