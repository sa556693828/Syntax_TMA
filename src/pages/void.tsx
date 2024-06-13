import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import { Context } from "@/components/Provider";
import { useBackButton, useInitData } from "@tma.js/sdk-react";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { EventEnum } from "@/types/types";
import bg from "@/assets/bgV.svg";
import Image from "next/image";
import Button from "@/components/ui/button";

interface Prompt {
  model: string;
  prompt: string;
  stream: boolean;
}

export default function Void() {
  const url = "https://a3bc-61-220-186-2.ngrok-free.app/api/generate";
  const { goPage, userData, updateUserToken } = useContext(Context);
  const [inputMode, setInputMode] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [aiRes, setAiRes] = useState("");
  const router = useRouter();
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };

  const aiAPI = async () => {
    try {
      const prompt = {
        model: "llama3",
        prompt: userInput,
        stream: false,
      };
      // const response = await axios.post(url, prompt);
      const sample = {
        model: "llama3",
        created_at: "2024-05-25T06:57:54.1377341Z",
        response: "I'll do my best to help you out.",
        done: true,
        done_reason: "stop",
        context: [
          128006, 882, 128007, 271, 35734, 128009, 128006, 78191, 128007, 271,
          2181, 5084, 1093, 499, 3940, 311, 2610, 264, 3488, 11, 719, 433, 2751,
          4018, 1022, 13, 16910, 499, 4587, 312, 28810, 477, 4686, 701, 3488,
          30, 358, 3358, 656, 856, 1888, 311, 1520, 499, 704, 13, 128009,
        ],
        total_duration: 1318726506,
        load_duration: 1355500,
        prompt_eval_duration: 343516000,
        eval_count: 37,
        eval_duration: 926039000,
      };
      // console.log(response.data);
      // setAiRes(response.data.choices[0].text);
      setAiRes(sample.response);
      // if(response.data.choices[0].text) {
      if (sample.response) {
        await updateUserToken(Number(userData.user_id), EventEnum.aiChat);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    backButton.show();
    backButton.on("click", onBackButtonClick);
    return () => {
      backButton.off("click", onBackButtonClick);
      backButton.hide();
    };
  }, []);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center bg-black">
      <Image
        src={bg}
        alt="bg"
        layout="fill"
        className="absolute left-0 top-0 z-10 object-cover object-center"
      />
      <div className="z-20 flex h-24 w-full items-center justify-center bg-transparent px-6 text-lg">
        <FaArrowLeftLong
          size={20}
          onClick={() => router.back()}
          className="absolute left-6 cursor-pointer hover:opacity-60"
        />
        <a className="text-nowrap">
          {inputMode ? "TALK TO THE VOID" : "THE VOID"}
        </a>
      </div>
      {!inputMode && (
        <div className="z-20 flex h-full w-full flex-col items-center justify-center px-1">
          <a className="text-xs uppercase tracking-[1.92px]">
            you stare in to the void
          </a>
          <Button
            handleClick={() => setInputMode(!inputMode)}
            className="my-20 h-[62px]"
          >
            {`CALL INTO THE VOID (2)`}
          </Button>
          <a className="text-xs uppercase tracking-[1.92px]">
            and the void stares back
          </a>
        </div>
      )}
      {inputMode && (
        <div className="z-20 flex h-full w-full flex-col items-center justify-between gap-4 overflow-hidden px-1 pt-14 text-center">
          <a className="max-w-[300px] overflow-y-auto text-center text-lg">
            {aiRes}
          </a>
          <div className="flex w-full flex-col items-center justify-end gap-9">
            <a className="text-xs opacity-60">{`(${userInput.length}/300)`}</a>
            <input
              className="h-14 w-full rounded-md border border-blackBg bg-black p-2 caret-white outline-none"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <Button handleClick={() => aiAPI()} className="h-[62px]">
              {`CALL INTO THE VOID (2)`}
            </Button>
          </div>
        </div>
      )}
      {/* {answer ? (
        <div className="flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl font-bold">Answer</h1>
          <p>{answer}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1">
          <h1 className="text-2xl font-bold">Prompt</h1>
          <textarea
            className="h-48 w-full rounded-lg border border-gray-300 p-2"
            value={prompt.prompt}
            onChange={(e) => setPrompt({ ...prompt, prompt: e.target.value })}
          />
          <button
            className="mt-2 rounded-lg border border-white px-6 py-2 text-white"
            onClick={async () => {
              const response = await aiAPI();
              setAnswer(response.choices[0].text);
            }}
          >
            Submit
          </button>
        </div>
      )} */}
    </div>
  );
}
