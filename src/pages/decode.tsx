import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { EventEnum, tableMap } from "@/types/types";
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
export default function Decode() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [viewArt, setViewArt] = useState(false);
  const [testScore, setTestScore] = useState<number>(0);
  const [score, setScore] = useState(new Array(8).fill(0.5));
  const [userValue, setUserValue] = useState<number>(0.5);
  const [loading, setLoading] = useState(false);
  const { userTG, reFetchUserData, goPage, userData, updateUserToken } =
    useContext(Context);
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const updateUserTestScore = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableMap.users)
        .update({ testScore: testScore })
        .eq("user_id", userTG?.id as number);
      if (error) {
        throw error;
      }
      if (testScore > 70) {
        updateUserToken(userTG?.id as number, EventEnum.dailyGameHighScore);
      }
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
    <div className="relative flex h-full min-h-[100vh] w-full flex-col items-center justify-center gap-1 p-1">
      {questionIndex === 8 ? (
        <>
          <Card className="flex h-full flex-col flex-1 items-start justify-start gap-4 p-12">
            <GridDot count={8} />
            <a className="whitespace-pre-wrap text-black">
              {`IN THE FUZZY, INACCURATE SYSTEM OF SYNTAX, YOU’VE GOTTEN A DECODE SCORE OF`}
            </a>
            <div className="w-full text-center">
              <a className="text-[128px] leading-[150%]">{Math.ceil(testScore)}</a>
            </div>
            <a className="text-xs">{`(PSST: ON GOOD DAYS, I SCORE ABOUT A 60. THANKS FOR PLAYING!)`}</a>
          </Card>
        </>
      ) : (
        <>
          <Card className="flex h-full flex-col items-start justify-start gap-4 p-12">
            <GridDot count={8} />
            <a className="flex-1 whitespace-pre-wrap text-black">
              {question[questionIndex].title}
            </a>
            <div className="relative z-50 size-full h-[286px] rounded-md bg-white">
              {/* {userData && userData.user_id && viewArt && (
            <Box
              userID={userData.user_id}
              userScore={score}
              fullScreen={true}
            />
          )} */}
            </div>
          </Card>
          <div className="flex w-full flex-col gap-[10px] bg-[#333] p-12">
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max="1"
                step="0.0001"
                defaultValue={0.5}
                value={userValue}
                className={`relative h-12 appearance-none rounded-lg bg-transparent`}
                onChange={(e) => handleChange(e)}
              />
              <div
                className={`pointer-events-none absolute -top-[10px] flex flex-col ${Math.round(userValue * 100) === 100 ? "items-end" : "items-center"} left-[${Math.round(userValue * 100)}%] -translate-x-[${Math.round(userValue * 100)}%] text-white `}
              >
                <a
                  className={`${Math.round(userValue * 100) === 100 ? "-mr-1" : Math.round(userValue * 100) === 0 ? "-ml-[2px]" : ""}`}
                >
                  {Math.round(userValue * 100)}
                </a>
                <div className="h-[2px] w-4 rounded bg-white" />
              </div>
            </div>
            <div className="flex w-full justify-between">
              <a className="text-xs text-white opacity-60">
                {question[questionIndex].value[0]}
              </a>
              <a className="text-xs text-white opacity-60">
                {question[questionIndex].value[1]}
              </a>
            </div>
          </div>
        </>
      )}
      <div className="h-[62px] w-full">
        <button
          className="flex h-full w-full items-center justify-center rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
          onClick={
            questionIndex === question.length
              ? () => handleSubmit()
              : () => handleNext()
          }
        >
          {loading ? (
            <div className="loader" />
          ) : questionIndex === question.length ? (
            "DONE"
          ) : (
            "NEXT"
          )}
        </button>
      </div>
    </div>
  );
}
