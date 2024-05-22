import { createContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useInitData } from "@tma.js/sdk-react";
import { tableMap, UserData, UserTG } from "@/types/types";
import { supabase } from "@/utils/supabase";

export const Context = createContext<{
  goPage: (page: any) => void;
  userTG: UserTG;
  userData: UserData;
  reFetchUserData: () => void;
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
  },
  reFetchUserData: () => {},
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
    console.log("initData", initData);
    const { user } = initData;
    setUserTG(user as UserTG);
  }, [initData]);
  const reFetchUserData = () => {
    setReGetUserData(!reGetUserData);
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

  return (
    <Context.Provider
      value={{
        goPage,
        userTG,
        userData,
        reFetchUserData,
      }}
    >
      {children}
    </Context.Provider>
  );
};
