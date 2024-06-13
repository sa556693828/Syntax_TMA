import { createContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useInitData } from "@tma.js/sdk-react";
import {
  EventType,
  EventEnum,
  tableMap,
  UserData,
  UserTG,
} from "@/types/types";
import { supabase } from "@/utils/supabase";
import { pointList } from "@/constants/pointList";

export const Context = createContext<{
  goPage: (page: any) => void;
  userTG: UserTG;
  userData: UserData;
  reFetchUserData: () => void;
  updateUserToken: (userId: number, event: EventType, amount?: number) => void;
}>({
  goPage: () => { },
  userTG: {
    allowsWriteToPm: false,
    firstName: "",
    id: null,
    isPremium: false,
    languageCode: "",
    lastName: "",
    username: "",
  },
  userData: {
    user_id: null,
    username: "",
    first_name: "",
    last_name: "",
    evm_address: "",
    google: "",
    twitter: "",
    github: "",
    recaptcha: false,
    email: "",
    score: [],
    ton_address: "",
    inviteFrom_id: null,
    testScore: null,
    friends: [],
    tokens: null,
  },
  reFetchUserData: () => { },
  updateUserToken: () => { },
});

export const Provider = ({ children }: { children: any }) => {
  const [userTG, setUserTG] = useState<UserTG>({
    allowsWriteToPm: false,
    firstName: "",
    id: null,
    isPremium: false,
    languageCode: "",
    lastName: "",
    username: "",
  });
  const [userData, setUserData] = useState<UserData>({
    user_id: null,
    username: "",
    first_name: "",
    last_name: "",
    evm_address: "",
    google: "",
    twitter: "",
    github: "",
    recaptcha: false,
    email: "",
    score: [],
    ton_address: "",
    inviteFrom_id: null,
    testScore: null,
    friends: [],
    tokens: null,
  });
  const [reGetUserData, setReGetUserData] = useState(false);
  const router = useRouter();
  const goPage = (page: any) => {
    router.push(page);
  };
  const initData = useInitData();

  const InitDataJson = useMemo(() => {
    if (!initData) {
      return <></>;
    }
    const { user } = initData;
    setUserTG(user as UserTG);
  }, [initData]);

  const reFetchUserData = () => {
    setReGetUserData(!reGetUserData);
  };
  const updateUserToken = async (userId: number, event: EventType, amount?: number) => {
    const addPoint = pointList[event];
    if (!userData) return;
    let totalPoint: number;
    if (event === EventEnum.buyToken) {
      if (amount === undefined) {
        console.error("Amount is required for buying tokens");
        return;
      }
      totalPoint = userData.tokens ? userData.tokens - amount : -amount;
    } else {
      totalPoint = userData.tokens ? userData.tokens + addPoint : addPoint;
    }

    try {
      const { error } = await supabase
        .from(tableMap.users)
        .update({ tokens: totalPoint })
        .eq("user_id", userId);

      if (!error) {
        reFetchUserData();
      } else {
        console.log("updateUserToken fail");
        throw new Error("updateUserToken fail");
      }
    } catch (e) {
      console.log(e);
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
  }, [userTG, reGetUserData]);

  useEffect(() => {
    async function addFriend() {
      if (
        !initData ||
        !initData.startParam ||
        !userData ||
        userData.user_id === null
      )
        return;
      const targetUser = Number(initData.startParam);
      const friends = userData.friends || [];
      //TODO: 顯示你和他已經是朋友
      const isAlreadyExist = friends.includes(targetUser);
      const isSelf = userData.user_id === targetUser;
      const { data: user } = await supabase
        .from(tableMap.users)
        .select("*")
        .eq("user_id", targetUser);
      if (!user || user.length === 0 || isAlreadyExist || isSelf) return;
      await supabase
        .from(tableMap.users)
        .update({ friends: [...friends, targetUser] })
        .eq("user_id", userTG?.id);
      await supabase
        .from(tableMap.users)
        .update({ friends: [...friends, userTG?.id] })
        .eq("user_id", targetUser);
      updateUserToken(targetUser, EventEnum.inviteFriends);
    }
    if (initData && initData.startParam && userData && userData.user_id)
      addFriend();
  }, [initData, userData]);

  return (
    <Context.Provider
      value={{
        goPage,
        userTG,
        userData,
        reFetchUserData,
        updateUserToken,
      }}
    >
      {children}
    </Context.Provider>
  );
};
