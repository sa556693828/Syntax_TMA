import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "@/components/Provider";
import { EventEnum, tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton } from "@tma.js/sdk-react";
import Card from "@/components/Card";
import GridDot from "@/components/ui/gridDot";
const question = [
  {
    title: "DO YOU RECHARGE BY BEING ALONE OR INTERACTING WITH OTHERS?",
    value: ["Introversion", "Extraversion"],
  },
  {
    title: "IS YOUR WORLDVIEW GROUNDED IN REALITY OR SHAPED BY WHAT COULD BE?",
    value: ["Sensing", "Intuition"],
  },
  {
    title:
      "IN DECISIONS, DO YOU PRIORITIZE OBJECTIVE LOGIC OR EMPATHETIC CONSIDERATIONS?",
    value: ["Thinking", "Feeling"],
  },
  {
    title:
      "DO YOU PREFER LIFE TO BE PLANNED OUT OR DO YOU REVEL IN SPONTANEITY?",
    value: ["Judging", "Perceiving"],
  },
  {
    title: "ARE YOU SHAPED BY YOUR INNATE NATURE OR YOUR ENVIRONMENT?",
    value: ["Nature", "Nurture"],
  },
  {
    title: "DO YOU FIND COMFORT IN STABILITY OR EMBRACE CHANGE?",
    value: ["Stability", "Change"],
  },
  {
    title:
      "ARE YOU MORE PESSIMISTIC OR OPTIMISTIC ABOUT LIFE AND ITS POSSIBILITIES?",
    value: ["Pessimism", "Optimism"],
  },
  {
    title: "DO PAST EXPERIENCES OR FUTURE CONSIDERATIONS GUIDE YOUR DECISIONS?",
    value: ["Past", "Future"],
  },
];
export default function Test() {
  const { userTG, userData, goPage, updateUserToken } = useContext(Context);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(new Array(8).fill(0.5));
  const [loading, setLoading] = useState(false);
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const { reFetchUserData } = useContext(Context);
  const updateUserScore = async (score: any, userID: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(tableMap.users)
        .update({ score: score })
        .eq("user_id", userID);
      if (error) throw error;
      reFetchUserData();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    let newScore = [...score];
    newScore[index] = parseFloat(event.target.value);
    setScore(newScore);
  };
  const handleSubmit = async () => {
    await updateUserScore(score, userTG?.id as number);
    await updateUserToken(Number(userData.user_id), EventEnum.firstTest);
    goPage("/art");
  };

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
    <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center gap-1 p-1">
      <Card className="flex h-full flex-col items-start justify-start gap-4 p-12">
        <GridDot count={questionIndex + 1} />
        <a className="flex-1">{question[questionIndex].title}</a>
        <a className="text-xs opacity-60">{`${questionIndex + 1
          }/${question.length}`}</a>
      </Card>
      <div className="flex w-full flex-col gap-[10px] bg-[#333] p-12">
        <div className="relative w-full">
          <input
            type="range"
            min="0"
            max="1"
            step="0.0001"
            defaultValue={
              userData.score !== null
                ? userData.score[questionIndex]
                : score[questionIndex]
            }
            value={score[questionIndex]}
            className={`h-12 rounded-lg bg-transparent`}
            onChange={(e) => handleChange(e, questionIndex)}
          />
          <div
            className={`pointer-events-none absolute -top-[10px] flex flex-col ${Math.round(score[questionIndex] * 100) === 100 ? "items-end" : "items-center"} left-[${Math.round(score[questionIndex] * 100)}%] -translate-x-[${Math.round(score[questionIndex] * 100)}%] text-white `}
          >
            <a
              className={`${Math.round(score[questionIndex] * 100) === 100 ? "-mr-1" : Math.round(score[questionIndex] * 100) === 0 ? "-ml-[2px]" : ""}`}
            >
              {Math.round(score[questionIndex] * 100)}
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
      <div className="h-[62px] w-full">
        <button
          className="flex h-full w-full items-center justify-center rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
          onClick={
            questionIndex === question.length - 1
              ? () => handleSubmit()
              : () => setQuestionIndex((prev: number) => prev + 1)
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
//left-[0%] -translate-x-[0%]
//left-[1%] -translate-x-[1%]
//left-[2%] -translate-x-[2%]
//left-[3%] -translate-x-[3%]
//left-[4%] -translate-x-[4%]
//left-[5%] -translate-x-[5%]
//left-[6%] -translate-x-[6%]
//left-[7%] -translate-x-[7%]
//left-[8%] -translate-x-[8%]
//left-[9%] -translate-x-[9%]
//left-[10%] -translate-x-[10%]
//left-[11%] -translate-x-[11%]
//left-[12%] -translate-x-[12%]
//left-[13%] -translate-x-[13%]
//left-[14%] -translate-x-[14%]
//left-[15%] -translate-x-[15%]
//left-[16%] -translate-x-[16%]
//left-[17%] -translate-x-[17%]
//left-[18%] -translate-x-[18%]
//left-[19%] -translate-x-[19%]
//left-[20%] -translate-x-[20%]
//left-[21%] -translate-x-[21%]
//left-[22%] -translate-x-[22%]
//left-[23%] -translate-x-[23%]
//left-[24%] -translate-x-[24%]
//left-[25%] -translate-x-[25%]
//left-[26%] -translate-x-[26%]
//left-[27%] -translate-x-[27%]
//left-[28%] -translate-x-[28%]
//left-[29%] -translate-x-[29%]
//left-[30%] -translate-x-[30%]
//left-[31%] -translate-x-[31%]
//left-[32%] -translate-x-[32%]
//left-[33%] -translate-x-[33%]
//left-[34%] -translate-x-[34%]
//left-[35%] -translate-x-[35%]
//left-[36%] -translate-x-[36%]
//left-[37%] -translate-x-[37%]
//left-[38%] -translate-x-[38%]
//left-[39%] -translate-x-[39%]
//left-[40%] -translate-x-[40%]
//left-[41%] -translate-x-[41%]
//left-[42%] -translate-x-[42%]
//left-[43%] -translate-x-[43%]
//left-[44%] -translate-x-[44%]
//left-[45%] -translate-x-[45%]
//left-[46%] -translate-x-[46%]
//left-[47%] -translate-x-[47%]
//left-[48%] -translate-x-[48%]
//left-[49%] -translate-x-[49%]
//left-[50%] -translate-x-[50%]
//left-[51%] -translate-x-[51%]
//left-[52%] -translate-x-[52%]
//left-[53%] -translate-x-[53%]
//left-[54%] -translate-x-[54%]
//left-[55%] -translate-x-[55%]
//left-[56%] -translate-x-[56%]
//left-[57%] -translate-x-[57%]
//left-[58%] -translate-x-[58%]
//left-[59%] -translate-x-[59%]
//left-[60%] -translate-x-[60%]
//left-[61%] -translate-x-[61%]
//left-[62%] -translate-x-[62%]
//left-[63%] -translate-x-[63%]
//left-[64%] -translate-x-[64%]
//left-[65%] -translate-x-[65%]
//left-[66%] -translate-x-[66%]
//left-[67%] -translate-x-[67%]
//left-[68%] -translate-x-[68%]
//left-[69%] -translate-x-[69%]
//left-[70%] -translate-x-[70%]
//left-[71%] -translate-x-[71%]
//left-[72%] -translate-x-[72%]
//left-[73%] -translate-x-[73%]
//left-[74%] -translate-x-[74%]
//left-[75%] -translate-x-[75%]
//left-[76%] -translate-x-[76%]
//left-[77%] -translate-x-[77%]
//left-[78%] -translate-x-[78%]
//left-[79%] -translate-x-[79%]
//left-[80%] -translate-x-[80%]
//left-[81%] -translate-x-[81%]
//left-[82%] -translate-x-[82%]
//left-[83%] -translate-x-[83%]
//left-[84%] -translate-x-[84%]
//left-[85%] -translate-x-[85%]
//left-[86%] -translate-x-[86%]
//left-[87%] -translate-x-[87%]
//left-[88%] -translate-x-[88%]
//left-[89%] -translate-x-[89%]
//left-[90%] -translate-x-[90%]
//left-[91%] -translate-x-[91%]
//left-[92%] -translate-x-[92%]
//left-[93%] -translate-x-[93%]
//left-[94%] -translate-x-[94%]
//left-[95%] -translate-x-[95%]
//left-[96%] -translate-x-[96%]
//left-[97%] -translate-x-[97%]
//left-[98%] -translate-x-[98%]
//left-[99%] -translate-x-[99%]
//left-[100%] -translate-x-[100%]
