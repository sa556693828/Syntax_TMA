interface DotProps {
  count: number;
  size?: "big" | "small";
  color?: "black" | "white";
}

export default function GridDot({
  count,
  size = "small",
  color = "black",
}: DotProps) {
  const dots: boolean[] = Array(16).fill(false);

  if (count >= 1 && count <= 8) {
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

  return (
    <div
      className={`grid ${size === "small" ? "size-[14px]" : "size-[56px]"} grid-cols-4 gap-[2px]`}
    >
      {dots.map((isColored, index) => (
        <div
          key={index}
          className={`${size === "small" ? "size-[2px]" : "size-[8px]"} rounded-[0.4px] ${
            color === "black"
              ? isColored
                ? "bg-blackBg"
                : "bg-blackBg/20"
              : isColored
                ? "bg-white"
                : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}
