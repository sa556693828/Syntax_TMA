import { cn } from "@/lib/utils";

interface DotProps {
  count?: number;
  size?: "big" | "small";
  color?: "black" | "white";
  type?: 'nature' | 'nurture' | 'stability' | 'pessimism' | 'past' | 'change' | 'optimism' | 'future';
  className?: string;
  handleClick?: () => void;
}

export default function GridDot({
  count,
  size = "small",
  color = "black",
  type,
  className,
  handleClick,
}: DotProps) {
  const dots: boolean[] = Array(16).fill(false);

  if (count && count >= 1 && count <= 8) {
    // 根据 count 的值选择格子的数量
    const numDots = count * 2;
    for (let i = 0; i < numDots; i++) {
      let randomIndex = Math.floor(Math.random() * 16);
      // 确保不选择已经被选中的格子
      while (dots[randomIndex]) {
        randomIndex = Math.floor(Math.random() * 16);
      }
      dots[randomIndex] = true;
    }
  }

  const NATURE = [false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false]
  const NURTURE = [true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, true]
  const STABILITY = [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false]
  const CHANGE = [true, false, true, false, false, true, false, true, true, false, true, false, false, true, false, true]
  const PESSIMISM = [false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false]
  const OPTIMISM = [false, true, true, false, true, true, true, true, true, true, true, true, false, true, true, false]
  const PAST = [true, false, false, true, true, false, true, false, true, true, false, false, true, true, true, true]
  const FUTURE = [true, true, true, true, false, false, true, true, false, true, false, true, true, false, false, true]

  const typeMap = {
    nature: NATURE,
    nurture: NURTURE,
    stability: STABILITY,
    change: CHANGE,
    pessimism: PESSIMISM,
    optimism: OPTIMISM,
    past: PAST,
    future: FUTURE
  }
  const view = () => {
    if (type) {
      return (
        typeMap[type].map((isColored, index) => (
          <div
            key={index}
            className={`${size === "small" ? "size-[2px]" : "size-[8px]"} rounded-[0.4px] ${color === "black"
              ? isColored
                ? "bg-blackBg"
                : "bg-blackBg/20"
              : isColored
                ? "bg-white"
                : "bg-white/20"
              }`}
          />
        ))
      )
    } else {
      return (
        dots.map((isColored, index) => (
          <div
            key={index}
            className={`${size === "small" ? "size-[2px]" : "size-[8px]"} rounded-[0.4px] ${color === "black"
              ? isColored
                ? "bg-blackBg"
                : "bg-blackBg/20"
              : isColored
                ? "bg-white"
                : "bg-white/20"
              }`}
          />
        ))
      )
    }

  }


  return (
    <div
      className={cn(
        `grid ${size === "small" ? "size-[14px]" : "size-[56px]"} z-20 grid-cols-4 gap-[2px]`,
        className,
      )}
      onClick={handleClick ? () => handleClick() : undefined}
    >

      {view()}
    </div>
  );
}
