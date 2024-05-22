import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "@/components/Provider";
import { useRouter } from "next/router";

export default function ProfileTab() {
  const { goPage } = useContext(Context);
  const router = useRouter();

  return (
    <>
      <button
        className={`flex h-full w-full items-center justify-center hover:text-white ${
          router.pathname === "/" ? "text-white" : "text-white/40"
        }`}
        onClick={() => goPage("/")}
      >
        ME
      </button>
      <button
        className={`flex h-full w-full items-center justify-center hover:text-white ${
          router.pathname === "/profile/friends"
            ? "text-white"
            : "text-white/40"
        }`}
        onClick={() => goPage("/profile/friends")}
      >
        FRIENDS
      </button>
    </>
  );
}
