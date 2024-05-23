import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import sample_2 from "@/assets/sample_2.png";
import Image from "next/image";
import { PiDotsNineBold } from "react-icons/pi";
import { Context } from "@/components/Provider";
import { tableMap } from "@/types/types";
import { supabase } from "@/utils/supabase";
import { useBackButton, useInitData } from "@tma.js/sdk-react";
import Card from "@/components/Card";
import GridDot from "@/components/ui/gridDot";
import Box from "@/components/p5/Art";
import { constants } from "buffer";
import axios from "axios";

interface Prompt {
  model: string;
  prompt: string;
  stream: boolean;
}

export default function Void() {
  const { goPage, userData } = useContext(Context);
  const backButton = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };

  const [answer, setAnswer] = useState<string>("");
  const [prompt, setPrompt] = useState<Prompt>({
    model: "phi3",
    prompt: "",
    stream: false,
  });

  const aiAPI = async () => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/engines/davinci-codex/completions",
        prompt,
        // {
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // },
      );
      console.log(response.data);
      return response.data;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-between gap-1 p-1">
      {answer ? (
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
      )}
    </div>
  );
}
