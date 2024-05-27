import { useCallback, useContext, useEffect, useState } from "react";
// import { useMainButton } from "@tma.js/sdk-react";
import sample_2 from "@/assets/sample_2.png";
import Image from "next/image";
import { PiDotsNineBold } from "react-icons/pi";
import { Context } from "@/components/Provider";
import Card from "@/components/Card";

export default function InitStory() {
  type State = 1 | 2 | 3;
  const { goPage, userData } = useContext(Context);
  const [state, setState] = useState<State>(1);
  const contentSection = useCallback(() => {
    if (state === 1) {
      return (
        <a className="tracking-[2.56x]">
          {`HI THERE! WELCOME TO “SYNTAX”. I’VE BEEN EXPLORING NEW WAYS TO CONVEY WHO WE ARE IN MEANINGFUL, INTIMATE WAYS WHILE KEEPING OUR PERSONAL INFORMATION SAFE.`}
        </a>
      );
    } else if (state === 2) {
      return (
        <>
          <a className="tracking-[2.56x]">
            {`WITHOUT GETTING ALL PHILOSOPHICAL (YET), HERE’S AN EXAMPLE OF WHAT YOU CAN MAKE USING THIS BOT:`}
          </a>
          <Image
            src={sample_2.src}
            alt="sample_2"
            className="size-[286px] rounded-lg"
            width={286}
            height={286}
          />
        </>
      );
    } else {
      return (
        <a className="tracking-[2.2px]">
          {`AN IDENTITY WITH NO FACES, NO NAMES, NO JOB TITLES; JUST YOUR ESSENCE VISUALIZED IN A NEW SYNTAX.`}
        </a>
      );
    }
  }, [state]);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-between gap-1 p-1">
      <Card className="flex h-full items-center justify-center px-12 py-4">
        <div className="flex flex-col gap-4">
          <PiDotsNineBold />
          {contentSection()}
          <a className="text-xs opacity-60">{`${state}/3`}</a>
        </div>
      </Card>

      <div className="h-[62px] w-full">
        <button
          className="h-full w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
          onClick={
            state === 3
              ? () => goPage("/test")
              : () => setState((prev: any) => prev + 1)
          }
        >
          {/* {state === 1 ? "AND...?" : state === 2 ? "HUH.." : "CREATE MY SYNTAX"} */}
          {state === 3 ? "LET’S GET STARTED" : "NEXT"}
        </button>
      </div>
    </div>
  );
}
