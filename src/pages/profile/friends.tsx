import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap, UserData } from "@/types/types";
import { supabase } from "@/utils/supabase";
import ProfileTab from "@/components/pagesUI/ProfilePage/ProfileTab";
import Box from "@/components/p5/Art";
import { getUsernameOrName } from "@/utils/helpers";

export default function Friends() {
  const { userData, userTG, reFetchUserData, goPage } = useContext(Context);
  const [friendsData, setFriendsData] = useState<UserData[]>([]);

  const handleAddFriendClick = () => {
    const url = "t.me/DEC42_Syntax_BOT/MBTI?startapp=1298152745";
    const text = `I'm playing Decode Syntax, a fun and insightful game that helps you understand yourself better. Let's play together!`;
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
  };
  //TODO:拿到好友列表，並獲取每個好友的分數

  useEffect(() => {
    const fetchFriendsData = async () => {
      const friends = userData.friends;
      const data = await Promise.all(
        friends.map(async (friend) => {
          const { data } = await supabase
            .from(tableMap.users)
            .select("*")
            .eq("user_id", friend);
          return data && data.length > 0 ? data[0] : null;
        }),
      );
      if (data.length === 0) return;
      setFriendsData(data as UserData[]);
    };
    if (userData.friends) {
      fetchFriendsData();
    }
  }, [userData]);

  return (
    <div className="relative z-20 flex h-full min-h-[100vh] w-full flex-col items-center gap-1 bg-black">
      <div className="z-20 flex h-24 w-full items-center justify-between bg-black px-6 text-lg text-white">
        <ProfileTab />
      </div>
      <div className="grid w-full grid-cols-2 gap-1 px-1 text-white">
        {friendsData?.map((friend, index) => (
          <div
            key={index}
            onClick={() => {
              goPage(`/profile/${friend?.user_id}/MBTI`);
            }}
            className="relative flex h-[189px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-white uppercase hover:opacity-80"
          >
            <Box
              userID={friend?.user_id as number}
              userScore={friend?.score as any}
              overScreen={true}
            />
            <a className="absolute bottom-1 left-1 z-50 text-xs text-white">
              {getUsernameOrName(friend)}
            </a>
          </div>
        ))}
        <div
          className="relative flex h-[189px] w-full cursor-pointer flex-col items-center justify-end rounded-lg bg-white p-1 uppercase text-black hover:opacity-80"
          onClick={() => handleAddFriendClick()}
        >
          <div className="w-full text-start">
            <a className="text-center text-xs">ADD FRIEND</a>
          </div>
        </div>
      </div>
    </div>
  );
}
