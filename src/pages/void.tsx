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
import { sleep } from "@ton-community/assets-sdk/dist/utils";
import { time } from "console";

interface Prompt {
  model: string;
  prompt: string;
  stream: boolean;
}

export default function Void() {
  const url = "https://9549-61-220-186-2.ngrok-free.app/api/generate";
  const { goPage, userData, updateUserToken } = useContext(Context);
  const [inputMode, setInputMode] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [AIMode, setAIMode] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [aiRes, setAiRes] = useState("");
  const router = useRouter();
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const reset = () => {
    setInputMode(false);
    setStep(0);
    setLoading(false);
    setAIMode(false);
    setUserInput("");
    setAiRes("");
  }

  const aiAPI = async () => {
    try {
      setLoading(true);
      const model = [
        "llama3",
        "qwen2:latest"
      ]
      const prompt = {
        model: model[0],
        prompt: userInput,
        stream: false,
      };
      const res = await axios.post(url, JSON.stringify(prompt), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      setAiRes(res.data.response);
      if (res.data) {
        setTimeout(() => {
          setLoading(false);
          setAIMode(true);
        }, 2000);
        await updateUserToken(Number(userData.user_id), EventEnum.aiChat);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("eruda").then((module) => {
        module.default.init();
      });
    }
  }, []);
  return (
    <div className="flex h-[100vh] w-full flex-col items-center bg-black">
      <Image
        src={bg}
        alt="bg"
        layout="fill"
        className="absolute left-0 top-0 z-10 object-cover object-center"
      />
      {!loading && (
        <div className="z-20 flex h-24 w-full items-center justify-center bg-transparent px-6 text-lg">
          <FaArrowLeftLong
            size={20}
            onClick={inputMode ? () => reset() : () => router.back()}
            className="absolute left-6 cursor-pointer hover:opacity-60"
          />
          <a className="text-nowrap">
            {inputMode ? "TALK TO THE VOID" : "THE VOID"}
          </a>
        </div>
      )}
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
        <div className="z-20 flex h-full w-full flex-col items-center justify-end gap-4 overflow-hidden px-1 pt-14 text-center">
          <div className="w-full absolute top-1/2 -translate-y-1/2 ">
            {AIMode ? (
              <div className={`transition-opacity h-[60vh] overflow-y-auto duration-1000 delay-200 ${AIMode ? "" : loading ? "opacity-0" : ""}`}>
                <a className="max-w-[300px] text-center text-lg whitespace-pre-wrap">
                  {aiRes}
                  {/* {`I'm glad you asked!\n\nThere are many styles that can bring out the best in someone, depending on their personality, preferences, and goals. Here are some popular options:\n\n1. **Minimalist**: Simple, clean-cut clothing with a focus on comfort and functionality. Perfect for those who value ease and practicality.\n2. **Classic**: Timeless, elegant pieces with a sophisticated edge. Suitable for those who appreciate tradition and refinement.\n3. **Boho Chic**: Free-spirited, eclectic attire with a mix of vintage and modern elements. Ideal for creatives who embrace individuality.\n4. **Modern**: Bold, contemporary styles that make a statement. Great for those who want to stand out and showcase their personality.\n5. **Elegant**: Sophisticated, refined clothing with a focus on quality and attention to detail. Suitable for those who value luxury and poise.\n6. **Casual**: Relaxed, comfortable attire perfect for everyday wear. Ideal for those who prioritize ease and convenience.\n7. **Trendy**: Fashion-forward styles that keep up with the latest trends. Great for those who enjoy staying current and expressing themselves through fashion.\n\nWhich one resonates with you?`} */}
                </a>
              </div>
            ) : (
              <div className={`flex w-full flex-col items-center justify-end gap-9 transition-opacity duration-1000 delay-200 ${AIMode ? "opacity-0" : loading ? "opacity-0" : ""}`}>
                <a className="text-xs opacity-60">{`(${userInput.length}/300)`}</a >
                <input
                  className="h-14 w-full rounded-md border border-blackBg bg-black p-2 caret-white outline-none"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
            )}
          </div>
          {!loading && !AIMode && (
            <Button handleClick={() => aiAPI()} className="h-[62px] flex items-center justify-center">
              {`CALL INTO THE VOID (2)`}
            </Button>
          )}
          {AIMode && (
            <Button handleClick={() => reset()} className="h-[62px] flex items-center justify-center">
              {`RETURN`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
