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
      className={`relative w-full rounded-lg bg-greyBg text-base uppercase tracking-[2.56px] text-black ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
}
