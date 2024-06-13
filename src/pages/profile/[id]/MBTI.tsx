import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "@/components/Provider";
import { useRouter } from "next/router";
import GridDot from "@/components/ui/gridDot";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaShareSquare } from "react-icons/fa";
import { supabase } from "@/utils/supabase";
import { tableMap, UserData } from "@/types/types";
import Box from "@/components/p5/Art";
import { useBackButton } from "@tma.js/sdk-react";
import { getUsernameOrName } from "@/utils/helpers";

export default function MBTI() {
  const MBTI_TITLE = [
    {
      title: ["Introversion", "Extraversion"],
      value: ["I", "E"],
    },
    {
      title: ["Sensing", "Intuition"],
      value: ["S", "N"],
    },
    {
      title: ["Thinking", "Feeling"],
      value: ["T", "F"],
    },
    {
      title: ["Judging", "Perceiving"],
      value: ["J", "P"],
    },
    {
      title: ["Nature", "Nurture"],
      value: [
        <GridDot type='nature' size="big" color="white" key={0} />,
        <GridDot type='nurture' size="big" color="white" key={1} />,
      ],
    },
    {
      title: ["Stability", "Change"],
      value: [
        <GridDot type='stability' size="big" color="white" key={2} />,
        <GridDot type='change' size="big" color="white" key={3} />,
      ],
    },
    {
      title: ["Pessimism", "Optimism"],
      value: [
        <GridDot type='pessimism' size="big" color="white" key={4} />,
        <GridDot type='optimism' size="big" color="white" key={5} />,
      ],
    },
    {
      title: ["Past", "Future"],
      value: [
        <GridDot type='past' size="big" color="white" key={6} />,
        <GridDot type='future' size="big" color="white" key={7} />,
      ],
    },
  ];
  const { goPage, userData } = useContext(Context);
  const router = useRouter();
  const id = router.query.id;
  const [targetUserData, setTargetUserData] = useState<UserData>();
  const isSelfMBTI = userData && Number(id) === userData.user_id;
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    router.back();
  };
  const getUserData = useCallback(async () => {
    if (id) {
      const { data: user } = await supabase
        .from(tableMap.users)
        .select("*")
        .eq("user_id", Number(id));
      if (user && user.length > 0) {
        setTargetUserData(user[0] as UserData);
      }
    }
  }, [id]);

  useEffect(() => {
    getUserData();
  }, [id]);
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
    <div className="relative z-20 flex h-full w-full flex-col items-center gap-1 bg-black">
      <div className="z-20 flex h-24 w-full items-center justify-between bg-black px-6 text-lg text-white">
        <FaArrowLeftLong
          size={20}
          onClick={() => router.back()}
          className="cursor-pointer hover:opacity-60"
        />
        <a className="absolute left-1/2 -translate-x-[48%] uppercase">
          {isSelfMBTI
            ? "MY SYNTAX"
            : targetUserData && getUsernameOrName(targetUserData as UserData)}
        </a>
        <FaShareSquare size={20} />
      </div>
      <div className="relative h-[382px] w-full rounded-lg uppercase">
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            fullScreen={true}
            userScore={userData.score as any}
          />
        )}
      </div>
      <div className="grid w-full grid-cols-2 gap-1">
        {targetUserData &&
          targetUserData.score &&
          targetUserData.score?.map((score, index) => (
            <div
              key={index}
              className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-blackBg p-1 uppercase text-white"
            >
              <div className="w-full text-start">
                <a className="text-center text-xs">
                  {score < 0.5
                    ? MBTI_TITLE[index].title[0]
                    : MBTI_TITLE[index].title[1]}
                </a>
              </div>
              <a className="text-[96px] tracking-[12.36px]">
                {score < 0.5
                  ? MBTI_TITLE[index].value[0]
                  : MBTI_TITLE[index].value[1]}
              </a>
              <div className="flex w-full justify-between">
                <a className="text-xs">{score * 100}</a>
                <a className="text-xs">%</a>
              </div>
            </div>
          ))}
        {isSelfMBTI ? (
          <div
            onClick={() => goPage("/test")}
            className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase text-black hover:opacity-80"
          >
            <div className="w-full text-start">
              <a className="text-center text-xs">REDO SYNTAX</a>
            </div>
            <a className="text-[96px] leading-[78.72px] tracking-[3.84px]">
              {/* {func.content} */}
              <GridDot count={0} size="big" />
            </a>
            <div className="flex w-full justify-between">
              {/* <a className="text-xs">{func.left}</a> */}
              {/* <a className="text-xs">{func.right}</a> */}
            </div>
          </div>
        ) : (
          <div className="relative flex h-[189px] w-full flex-col items-center justify-between rounded-lg bg-white px-2 py-1 uppercase text-black hover:opacity-80">
            <div className="w-full text-start">
              <a className="text-center text-xs">DECODE SYNTAX</a>
            </div>
            <a className="text-[96px] leading-[78.72px] tracking-[3.84px]">
              {targetUserData && targetUserData.testScore
                ? Math.ceil(targetUserData.testScore)
                : "?"}
            </a>
            <div className="flex w-full justify-between">
              <a className="text-xs">%</a>
              <a className="text-xs">DECODED</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
