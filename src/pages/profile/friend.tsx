import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import Card from "@/components/Card";
import GridDot from "@/components/ui/gridDot";
import Box from "@/components/p5/Art";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaShareSquare } from "react-icons/fa";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";

export default function Friends() {
  const { userData } = useContext(Context);
  return (
    <>
      <div className="absolute z-20 flex h-24 w-full items-center justify-between bg-transparent px-6 text-[20px] tracking-[3.2px] text-white">
        <ProfileTab />
      </div>

      <div className="grid w-full grid-cols-2 gap-1">
        {userData.score &&
          userData.score?.map((score, index) => (
            <div
              key={index}
              className="relative flex h-[189px] w-full flex-col justify-end rounded-lg bg-[#333] p-1 uppercase text-white"
            >
              {/* <Box
                  userID={userData.user_id as number}
                  userScore={userData.score as any}
                  className="left-[4px] top-[4px] z-10"
                /> */}
              <a className="z-50 text-xs tracking-[1.92px]">friend name</a>
            </div>
          ))}
        <div className="relative flex h-[189px] w-full flex-col items-center justify-end rounded-lg bg-greyBg p-1 uppercase text-black">
          <div className="w-full text-start">
            <a className="text-center text-xs tracking-[1.92px]">ADD FRIEND</a>
          </div>
        </div>
      </div>
    </>
  );
}
