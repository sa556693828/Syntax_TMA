"use client";

interface TestProps {
  value: number;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
}

export default function Slider({ value, handleChange }: TestProps) {
  return (
    <>
      <input type="range" min="0" max="100" value="10" className="range" />
    </>
  );
}
