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
  goPage: () => {},
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
  reFetchUserData: () => {},
  updateUserToken: () => {},
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
  const updateUserToken = async (
    userId: number,
    event: EventType,
    amount?: number,
  ) => {
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
          return existingUser;
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
  }, [userTG, reGetUserData]);

  useEffect(() => {
    async function addFriend() {
      console.log("addFriend", initData?.startParam);
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
