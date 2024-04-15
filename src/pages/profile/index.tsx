import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import Card from "@/components/Card";
import GridDot from "@/components/ui/gridDot";
import Box from "@/components/p5/Art";

function Friends() {
  const { userData } = useContext(Context);
  return (
    <>
      <div className="grid grid-cols-2 gap-1 w-full">
        {userData.score &&
          userData.score?.map((score, index) => (
            <div
              key={index}
              className="bg-[#333] w-full h-[189px] text-white relative flex flex-col justify-end uppercase rounded-lg p-1"
            >
              {/* <Box
                userID={userData.user_id as number}
                userScore={userData.score as any}
              /> */}
              <a className="tracking-[1.92px] text-xs z-50">friend name</a>
            </div>
          ))}
        <div className="bg-greyBg w-full h-[189px] text-black relative flex flex-col justify-end items-center uppercase rounded-lg p-1">
          <div className="w-full text-start">
            <a className="text-center tracking-[1.92px] text-xs">ADD FRIEND</a>
          </div>
        </div>
      </div>
    </>
  );
}

function Me() {
  const { userData, goPage } = useContext(Context);
  return (
    <>
      <div className="bg-[#333] w-full mt-1 relative p-1 uppercase rounded-lg h-[374px]">
        {userData && userData.user_id && userData.score && (
          <Box userID={userData.user_id} userScore={userData.score as any} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-1 w-full">
        {userData.score &&
          userData.score?.map((score, index) => (
            <div
              key={index}
              className="bg-[#333] w-full h-[189px] text-white relative flex flex-col justify-between items-center uppercase rounded-lg p-1"
            >
              <div className="w-full text-start">
                <a className="text-center tracking-[1.92px] text-xs">
                  PERSONALITY {index + 1}
                </a>
              </div>
              <a className="text-[96px] tracking-[12.36px]">
                {score > 0.5 ? "E" : "I"}
              </a>
              <div className="w-full justify-between flex">
                <a className="tracking-[1.92px] text-xs">{score * 100}</a>
                <a className="tracking-[1.92px] text-xs">%</a>
              </div>
            </div>
          ))}
        <div className="bg-greyBg w-full h-[189px] text-black relative flex flex-col justify-between items-center uppercase rounded-lg p-1">
          <div className="w-full text-start">
            <a className="text-center tracking-[1.92px] text-xs">REDO TEST</a>
          </div>
        </div>
        <div className="bg-greyBg w-full h-[189px] text-black relative flex flex-col justify-between items-center uppercase rounded-lg p-1">
          <div className="w-full text-start">
            <a className="text-center tracking-[1.92px] text-xs">
              HIGHEST SCORE
            </a>
          </div>
          <a className="text-[96px] tracking-[12.36px]">0</a>
          <div className="w-full justify-between flex">
            <a className="tracking-[1.92px] text-xs">%</a>
            <a className="tracking-[1.92px] text-xs">ACCURACY</a>
          </div>
        </div>
      </div>
      <div className="w-full h-[62px]">
        <button
          className="text-[20px] leading-[150%] w-full h-full rounded-md bg-greyBg hover:bg-greyBg/80 text-blackBg tracking-[3.2px]"
          onClick={() => goPage("/profile")}
        >
          {"GENERATE NFT"}
        </button>
      </div>
    </>
  );
}

export default function Profile() {
  const [page, setPage] = useState<"me" | "friend">("me");
  const [loading, setLoading] = useState(false);
  const { goPage } = useContext(Context);
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const { reFetchUserData } = useContext(Context);
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
    backButton.show();
    backButton.on("click", onBackButtonClick);
    return () => {
      backButton.off("click", onBackButtonClick);
      backButton.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center gap-1 p-1 h-full">
      <div className="h-20 border-b text-[20px] tracking-[3.2px] border-white/60 w-full flex justify-between text-white ">
        <button
          className={`w-full flex items-center justify-center h-full hover:text-white ${
            page === "me" ? "text-white" : "text-white/40"
          }`}
          onClick={() => setPage("me")}
        >
          ME
        </button>
        <button
          className={`w-full flex items-center justify-center h-full hover:text-white ${
            page === "friend" ? "text-white" : "text-white/40"
          }`}
          onClick={() => setPage("friend")}
        >
          FRIENDS
        </button>
      </div>
      {page === "me" ? <Me /> : <Friends />}
    </div>
  );
}
