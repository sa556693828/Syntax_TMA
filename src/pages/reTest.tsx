import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import Card from "@/components/Card";
import GridDot from "@/components/ui/gridDot";
import { PiDotsNineBold } from "react-icons/pi";
import Box from "@/components/p5/Art";
const question = [
  {
    title: "Introversion,\nOr Extraversion",
    value: ["Introversion", "Extraversion"],
  },
  {
    title: "Sensing,\nOr Intuition",
    value: ["Sensing", "Intuition"],
  },
  {
    title: "Thinking,\nOr Feeling",
    value: ["Thinking", "Feeling"],
  },
  {
    title: "Judging,\nOr Perceiving",
    value: ["Judging", "Perceiving"],
  },
  {
    title: "Nature,\nOr Nurture",
    value: ["Nature", "Nurture"],
  },
  {
    title: "Stability,\nOr Change",
    value: ["Stability", "Change"],
  },
  {
    title: "Pessimism,\nOr Optimism",
    value: ["Pessimism", "Optimism"],
  },
  {
    title: "Past,\nOr Future",
    value: ["Past", "Future"],
  },
];
export default function ReTest() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [viewArt, setViewArt] = useState(false);
  const [testScore, setTestScore] = useState<number>(0);
  const [score, setScore] = useState(new Array(8).fill(0.5));
  const [userValue, setUserValue] = useState<number>(0.5);
  const [loading, setLoading] = useState(false);
  const { userTG, reFetchUserData, goPage, userData } = useContext(Context);
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("profile");
  };
  const updateUserTestScore = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableMap.users)
        .update({ testScore: testScore })
        .eq("user_id", userTG?.id as number);
      if (error) throw error;
      reFetchUserData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = parseFloat(event.target.value);
    setUserValue(userAnswer);
  };
  const handleNext = () => {
    setQuestionIndex((prev: number) => prev + 1);
    let newScore = [...score];
    if (Math.abs(newScore[questionIndex] - userValue) < 0.1)
      setTestScore((prev) => prev + 12.5);
  };
  const handleSubmit = async () => {
    await updateUserTestScore();
    onBackButtonClick();
  };
  const randomScore = async () => {
    let newScore = [...score];
    newScore = newScore.map(() => Math.random().toFixed(4));
    setScore(newScore);
    setViewArt(true);
  };
  useEffect(() => {
    randomScore();
  }, []);
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
    <div className="relative w-full flex flex-col items-center justify-center gap-1 p-1 h-full min-h-[100dvh]">
      <Card className="h-full flex flex-col items-start justify-start p-12 gap-4">
        <GridDot count={8} />
        <a className="flex-1 whitespace-pre-wrap">
          {question[questionIndex].title}
        </a>
        <div className="flex flex-wrap flex-col w-10">
          <a className="text-xs">yourValue: {JSON.stringify(userValue)}</a>
        </div>
        <div className="size-full relative h-[286px] z-50 rounded-md bg-white">
          {userData && userData.user_id && viewArt && (
            <Box
              userID={userData.user_id}
              userScore={score}
              fullScreen={true}
            />
          )}
        </div>
        <a className="opacity-60 text-xs tracking-[1.92px]">{`${
          questionIndex + 1
        }/${question.length}`}</a>
      </Card>
      <div className="flex flex-col gap-[10px] w-full p-12 bg-[#333]">
        <input
          type="range"
          min="0"
          max="1"
          step="0.0001"
          //   value={
          //     userData.score !== null ? userData.score[index] : score[index]
          //   }
          defaultValue={0.5}
          value={userValue}
          className={`appearance-none relative rounded-lg bg-transparent h-12`}
          onChange={(e) => handleChange(e)}
        />
        <div className="flex w-full justify-between">
          <a className="text-xs tracking-[1.92px] opacity-60 text-white">
            {question[questionIndex].value[0]}
          </a>
          <a className="text-xs tracking-[1.92px] opacity-60 text-white">
            {question[questionIndex].value[1]}
          </a>
        </div>
      </div>
      <div className="w-full h-[62px]">
        <button
          className="text-[20px] flex items-center justify-center leading-[150%] border w-full h-full rounded-md hover:border-white/20 bg-white hover:bg-white/80 text-blackBg tracking-[3.2px]"
          onClick={
            questionIndex === question.length - 1
              ? () => handleSubmit()
              : () => handleNext()
          }
        >
          {loading ? (
            <div className="loader" />
          ) : questionIndex === question.length - 1 ? (
            "GENERATE MY SYNTAX"
          ) : (
            "NEXT"
          )}
        </button>
      </div>
    </div>
  );
}
