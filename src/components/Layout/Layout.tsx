import { useRouter } from "next/router";
import React from "react";
import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  // const isMobile = useBreakpointValue({ base: true, lg: false });
  const urlPath = useRouter().pathname;
  const router = useRouter();

  return (
    <>
      {/* <Header urlPath={urlPath} /> */}
      <main
        className="max-w-[100dvw]"
        style={{
          // minHeight: "calc(100dvh)",
          minHeight: "100dvh",
        }}
      >
        {children}
      </main>
      {/* <Footer urlPath={urlPath} /> */}
    </>
  );
}
