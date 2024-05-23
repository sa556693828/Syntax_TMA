import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";

export default function Friends() {
  const { userData, userTG, reFetchUserData, goPage } = useContext(Context);
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

  const handleAddFriendClick = () => {
    const url = "t.me/DEC42_Syntax_BOT/MBTI?startapp=1298152745";
    const text = `I'm playing Decode Syntax, a fun and insightful game that helps you understand yourself better. Let's play together!`;
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };
  //TODO:拿到好友列表，並獲取每個好友的分數

  return (
    <div className="relative z-20 flex h-full min-h-[100vh] w-full flex-col items-center gap-1 bg-black">
      <div className="z-20 flex h-24 w-full items-center justify-between bg-black px-6 text-[20px] tracking-[3.2px] text-white">
        <ProfileTab />
      </div>

      <div className="grid w-full grid-cols-2 gap-1">
        {userData.friends &&
          userData.friends?.map((friend, index) => (
            <div
              key={index}
              onClick={() => {
                goPage(`/profile/${friend}/MBTI`);
              }}
              className="relative flex h-[189px] w-full cursor-pointer flex-col justify-end rounded-lg bg-[#333] p-1 uppercase text-white"
            >
              {/* <Box
                  userID={userData.user_id as number}
                  userScore={userData.score as any}
                  className="left-[4px] top-[4px] z-10"
                /> */}
              <a className="z-50 text-xs tracking-[1.92px]">{friend}</a>
            </div>
          ))}
        <div
          className="relative flex h-[189px] w-full cursor-pointer flex-col items-center justify-end rounded-lg bg-white p-1 uppercase text-black hover:opacity-80"
          onClick={() => handleAddFriendClick()}
        >
          <div className="w-full text-start">
            <a className="text-center text-xs tracking-[1.92px]">ADD FRIEND</a>
          </div>
        </div>
      </div>
    </div>
  );
}
