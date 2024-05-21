import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import { Context } from "@/components/Provider";
import { useRouter } from "next/router";
import { useInitData } from "@tma.js/sdk-react";
import { supabase } from "@/utils/supabase";
import { tableMap, UserData } from "@/types/types";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";

interface MeFunction {
  title: string;
  content: string | number;
  left: string;
  right: string;
  onClick: () => void;
}
export default function Home() {
  const router = useRouter();
  const initData = useInitData();
  const { user: userTG } = initData as any;
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const { goPage, reFetchUserData } = useContext(Context);
  const meFunction: MeFunction[] = [
    {
      title: "DECODE SYNTAX",
      content: userData?.testScore ? Math.ceil(userData.testScore) : "?",
      left: "%",
      right: "DECODED",
      onClick: () => goPage("/myPersonality"),
    },
    {
      title: "THE VOID",
      content: "2",
      left: "ACTIONS",
      right: "LEFT",
      onClick: () => goPage("/void"),
    },
    {
      title: "THE LOGOBOOK",
      content: "?",
      left: "STORY &",
      right: "PHILOPHY",
      onClick: () => goPage("/initStory"),
    },
    {
      title: "SYNTKN",
      content: "!",
      left: "REWARDS",
      right: "AWAIT",
      onClick: () => goPage("/myPersonality"),
    },
  ];

  const updateUserScore = async (score: any, userID: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableMap.users)
        .update({ score: score })
        .eq("user_id", userID);
      if (error) throw error;
      reFetchUserData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    async function getUser() {
      const { data: user } = await supabase
        .from(tableMap.users)
        .select("*")
        .eq("user_id", userTG?.id);
      if (user && user.length > 0) {
        setUserData(user[0] as UserData);
      }
    }
    if (userTG) getUser();
  }, [userTG]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("eruda").then((module) => {
        module.default.init();
      });
    }
  }, []);
  useEffect(() => {
    if (userTG && userData && userData.score && userData.score.length === 0) {
      router.push("/initStory");
    }
  }, [userData, userTG]);
  useEffect(() => {
    setTimeout(() => {
      setLoadingTime(true);
    }, 1000);
  }, []);

  if (!userData || !userData.score || !loadingTime) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center text-white">
        <span className="loaderPage"></span>
      </div>
    );
  }
  return (
    <div className="relative z-20 flex h-full w-full flex-col items-center gap-1">
      <div className="absolute z-20 flex h-24 w-full items-center justify-between bg-transparent px-6 text-[20px] tracking-[3.2px] text-white">
        <ProfileTab />
      </div>
      <div className="relative h-[400px] w-full rounded-lg uppercase">
        {/* {userData && userData.user_id && userData.score && (
            <Box
              userID={userData.user_id}
              fullScreen={true}
              userScore={userData.score as any}
            />
          )} */}
        <div className="absolute -bottom-8 flex w-full items-end justify-between px-4 text-white">
          <a className="text-[80px] leading-none">10</a>
          <a className="pb-2 text-xs leading-none tracking-[1.92px]">syntkns</a>
        </div>
      </div>
      <div className="mt-20 grid w-full grid-cols-2 gap-1">
        <div
          className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase hover:opacity-80"
          onClick={() => goPage("/profile/MBTI")}
        >
          <div className="w-full text-start">
            <a className="text-center text-xs tracking-[1.92px]">My SYNTAX</a>
          </div>
          <a className="whitespace-pre-wrap text-[48px] leading-none tracking-[4.8px]">{`IN\nTJ`}</a>
          <div className="flex w-full justify-between">
            <a className="text-xs tracking-[1.92px]">&</a>
            <a className="text-xs tracking-[1.92px]">more</a>
          </div>
        </div>
        {meFunction?.map((func: MeFunction, index) => (
          <div
            key={index}
            onClick={func.onClick}
            className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase hover:opacity-80"
          >
            <div className="w-full text-start">
              <a className="text-center text-xs tracking-[1.92px]">
                {func.title}
              </a>
            </div>
            <a className="text-[96px] leading-[78.72px] tracking-[3.84px]">
              {func.content}
            </a>
            <div className="flex w-full justify-between">
              <a className="text-xs tracking-[1.92px]">{func.left}</a>
              <a className="text-xs tracking-[1.92px]">{func.right}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
