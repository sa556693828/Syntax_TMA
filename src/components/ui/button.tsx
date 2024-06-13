import { cn } from "@/lib/utils";
interface ButtonProps {
  handleClick: () => void;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export default function Button({
  className,
  handleClick,
  children,
  disabled,
}: ButtonProps) {
  return (
    <button
      className={cn(
        `h-full w-full rounded-md text-lg text-blackBg ${disabled ? "cursor-not-allowed bg-[#333]" : "bg-white hover:bg-white/80"}`,
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
