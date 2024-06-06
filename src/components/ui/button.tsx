import { cn } from "@/lib/utils";
interface ButtonProps {
  handleClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function Button({
  className,
  handleClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(
        "h-full w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80",
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
