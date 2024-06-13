"use client";

export default function InfoCard({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-center justify-between rounded-lg bg-blackBg px-12 text-base uppercase tracking-[2.56px] ${
        className ? className : "text-white"
      }`}
    >
      {children}
    </div>
  );
}
