import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        blackBg: "#1c1c1c",
        greyBg: "#B3B3B3",
        grey: "#2a2a2a",
        white: "#F5F5F5",
      },
      fontSize: {
        xs: [
          "12px",
          {
            // lineHeight: "150%",
            letterSpacing: "1.92px",
          },
        ],
        lg: [
          "20px",
          {
            lineHeight: "150%",
            letterSpacing: "3.2px",
          },
        ],
      },
    },
  },

  plugins: [],
};
export default config;
