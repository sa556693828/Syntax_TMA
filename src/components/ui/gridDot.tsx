interface DotProps {
  count: number;
}

export default function GridDot({ count }: DotProps) {
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
    <div className="size-[14px] grid grid-cols-4 gap-[2px]">
      {dots.map((isColored, index) => (
        <div
          key={index}
          className={`size-[2px] rounded-[0.4px] ${
            isColored ? "bg-blackBg" : "bg-blackBg/20"
          }`}
        />
      ))}
    </div>
  );
}
