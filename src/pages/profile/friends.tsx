import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";

export default function Friends() {
  const { userData, userTG, reFetchUserData } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const updateUserFriends = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableMap.users)
        .update({ friends: [] })
        .eq("user_id", userTG?.id as number);
      if (error) throw error;
      reFetchUserData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="z-20 flex h-24 w-full items-center justify-between bg-black px-6 text-[20px] tracking-[3.2px] text-white">
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
        <div
          className="relative flex h-[189px] w-full flex-col items-center justify-end rounded-lg bg-white p-1 uppercase text-black"
          // onClick={()=>}
        >
          <div className="w-full text-start">
            <a className="text-center text-xs tracking-[1.92px]">ADD FRIEND</a>
          </div>
        </div>
      </div>
    </>
  );
}
