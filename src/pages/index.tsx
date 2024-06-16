import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import { Context } from "@/components/Provider";
import { useRouter } from "next/router";
import { useInitData } from "@tma.js/sdk-react";
import { supabase } from "@/utils/supabase";
import { EventEnum, tableMap, UserData } from "@/types/types";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";
import Box from "@/components/p5/Art";
import { postEvent } from "@tma.js/sdk";
import GridDot from "@/components/ui/gridDot";

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
  const [introMode, setIntroMode] = useState(false);
  const [loadingTime, setLoadingTime] = useState(false);
  const { goPage, updateUserToken, reFetchUserData } = useContext(Context);
  const meFunction: MeFunction[] = [
    {
      title: "DECODE SYNTAX",
      content: userData?.testScore ? Math.ceil(userData.testScore) : "?",
      left: "%",
      right: "DECODED",
      onClick: () => {
        goPage("/decode");
        updateUserToken(userTG.id, EventEnum.dailyGame);
      },
    },
    {
      title: "THE VOID",
      content: "2",
      left: "ACTIONS",
      right: "LEFT",
      onClick: () => goPage("/void"),
    },
    {
      title: "THE LOGBOOK",
      content: "?",
      left: "STORY &",
      right: "PHILOPHY",
      onClick: () => goPage("/logbook"),
    },
    {
      title: "SYNTKN",
      content: "!",
      left: "REWARDS",
      right: "AWAIT",
      onClick: () => {
        goPage("/exchange");
      },
    },
  ];
  const pointIntro = `YOU EARN POINTS (PTS) THROUGH PLAYING WITH SYNTAX IN VARIOUS WAYS AND BY SHARING SYNTAX WITH YOUR FRIENDS!\n\nYOUR POINTS CAN BE EXCHANGED FOR SYNTAX TOKENS (STX) AND WILL BE USED FOR VARIOUS REWARDS IN THE FUTURE AT THE SYNTKN EXCHANGE!`;

  useEffect(() => {
    async function getOrCreateUser({
      userId,
      userName,
      firstName,
      lastName,
    }: {
      userId: number;
      userName?: string;
      firstName?: string;
      lastName?: string;
    }) {
      try {
        const { data: existingUser, error: userError } = await supabase
          .from(tableMap.users)
          .select("*")
          .eq("user_id", userId);
        if (userError) {
          throw userError;
        }
        if (existingUser.length > 0) {
          setUserData(existingUser[0] as UserData);
        } else {
          const { error: newUserError } = await supabase
            .from(tableMap.users)
            .insert([
              {
                user_id: userId,
                username: userName ? userName : undefined,
                first_name: firstName ? firstName : undefined,
                last_name: lastName ? lastName : undefined,
              },
            ])
            .single();
          if (newUserError) {
            throw newUserError;
          }
          const { data: newUserRows, error: newUserRowsError } = await supabase
            .from(tableMap.users)
            .select("*")
            .eq("user_id", userId)
            .single();

          if (newUserRowsError) {
            throw newUserRowsError;
          }
          reFetchUserData();
          console.log("newUserRows", newUserRows[0]);
          setUserData(newUserRows[0] as UserData);
          return newUserRows;
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
    if (userTG)
      getOrCreateUser({
        userId: Number(userTG.id),
        userName: userTG.username,
        firstName: userTG.firstName,
        lastName: userTG.lastName,
      });
  }, [userTG]);

  useEffect(() => {
    console.log("userData", userData);
    if (userTG && userData && userData.score === null) {
      router.push("/initStory");
    }
  }, [userData, userTG, userData?.score]);

  useEffect(() => {
    setTimeout(() => {
      setLoadingTime(true);
    }, 1000);
    return () => {
      setLoadingTime(false);
    };
  }, []);
  useEffect(() => {
    postEvent("web_app_expand");
  }, []);

  if (!userData || !userData.score || !loadingTime) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center text-white">
        <span className="loaderPage"></span>
      </div>
    );
  }

  return (
    <div className="relative z-20 flex h-full w-full flex-col items-center gap-1 bg-black">
      <div className="absolute z-20 flex h-24 w-full items-center justify-between bg-transparent px-6 text-lg text-white">
        <ProfileTab />
      </div>
      <div className="relative h-[400px] w-full rounded-lg uppercase">
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            fullScreen={true}
            userScore={userData.score as any}
          />
        )}
        <div className="absolute -bottom-8 flex w-full items-end justify-between px-4 text-white">
          <div className="flex items-end gap-4">
            <a className="z-20 text-[80px] leading-none">
              {userData && userData.tokens ? userData.tokens : 0}
            </a>
            <GridDot
              color="white"
              count={2}
              className="cursor-pointer pb-7"
              handleClick={() => setIntroMode(!introMode)}
            />
          </div>
          <a className="z-20 pb-2 text-xs leading-none">PTS</a>
        </div>
      </div>
      {introMode ? (
        <div className="mt-20 h-full w-full whitespace-pre-wrap bg-black px-4 text-xs leading-[150%]">
          <a>{pointIntro}</a>
        </div>
      ) : (
        <div className="mt-20 grid w-full grid-cols-2 gap-1">
          <div
            className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase text-black hover:opacity-80"
            onClick={() => goPage(`/profile/${userData.user_id}/MBTI`)}
          >
            <div className="w-full text-start">
              <a className="text-center text-xs">My SYNTAX</a>
            </div>
            <a className="whitespace-pre-wrap text-[48px] leading-none tracking-[4.8px]">{`IN\nTJ`}</a>
            <div className="flex w-full justify-between">
              <a className="text-xs">&</a>
              <a className="text-xs">more</a>
            </div>
          </div>
          {meFunction?.map((func: MeFunction, index) => (
            <div
              key={index}
              onClick={func.onClick}
              className="relative flex h-[189px] w-full cursor-pointer flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase text-black hover:opacity-80"
            >
              <div className="w-full text-start">
                <a className="text-center text-xs">{func.title}</a>
              </div>
              <a className="text-[96px] leading-[78.72px] tracking-[3.84px]">
                {func.content}
              </a>
              <div className="flex w-full justify-between">
                <a className="text-xs">{func.left}</a>
                <a className="text-xs">{func.right}</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
