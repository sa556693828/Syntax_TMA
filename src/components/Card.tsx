"use client";

export default function Card({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-greyBg w-full relative uppercase rounded-lg tracking-[2.56px] text-base ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}
