export function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-12 items-center justify-center rounded-base bg-primary text-primary-foreground transition duration-300 group-hover:scale-105">
      {children}
    </div>
  );
}
