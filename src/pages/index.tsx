import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import { Context } from "@/components/Provider";
import Profile from "@/components/pagesUI/ProfilePage";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { userData } = useContext(Context);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("eruda").then((module) => {
        module.default.init();
      });
    }
  }, []);
  useEffect(() => {
    if (userData && userData.score && userData.score.length === 0) {
      router.push("/initStory");
    }
  }, [userData, userData.score]);

  // const mainButton = useMainButton();
  // useEffect(() => {
  //   mainButton.enable().show();
  //   return () => {
  //     mainButton.hide();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   const onMainButtonClick = () => {
  //     if (state === 3) {
  //       goPage("/test");
  //     } else {
  //       setState((prev: any) => prev + 1);
  //     }
  //   };
  //   mainButton.setBackgroundColor("#FFFFFF");
  //   mainButton.setTextColor("#000000");

  //   mainButton.on("click", onMainButtonClick);

  //   return () => {
  //     mainButton.off("click", onMainButtonClick);
  //   };
  // }, [mainButton, state, goPage]);

  // useEffect(() => {
  //   if (state === 1) {
  //     mainButton.setText("AND...?");
  //   } else if (state === 2) {
  //     mainButton.setText("HUH..");
  //   } else {
  //     mainButton.setText("CREATE MY SYNTAX");
  //   }
  // }, [mainButton, state]);
  if (!userData || !userData.score) {
    return <div className="text-white">Loading...</div>;
  }
  return <Profile />;
}
