import Card from "@/components/Card";
import Box from "@/components/p5/Art";
import { Context } from "@/components/Provider";
import GridDot from "@/components/ui/gridDot";
import { useBackButton, useMainButton, useViewport } from "@tma.js/sdk-react";
import { useContext, useEffect, useState } from "react";

export default function Art() {
  const backButton = useBackButton();
  const mainButton = useMainButton();
  const { userData, goPage } = useContext(Context);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRevealed(true);
    }, 4000);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-1 p-1">
      <div className="relative h-[382px] w-full rounded-lg bg-[#333] p-1 uppercase">
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={userData.score as any}
            className="left-[4px] top-[4px] z-10"
          />
        )}
      </div>
      <Card className="flex flex-col items-start justify-start gap-4 p-12">
        <GridDot count={8} />
        {/* TODO:確認內容 STATE 一個一個出來 */}
        <a className="text-base tracking-[2.56px]">{`THIS IS MY INTERPRETATION OF YOUR SYNTAX AS SOMEONE WHO IS A TAD INTROVERTED, PRETTY INTUITIVE, VERY RATIONAL, SOMEWHAT JUDGING, ENVIRONMENT-NURTURED, A TAD CHANGE SEEKING, PESSIMISTIC, AND FUTURE-ORIENTED.`}</a>
      </Card>
      <Card className="flex flex-col items-start justify-start gap-4 p-12">
        <GridDot count={8} />
        <a className="text-base tracking-[2.4px]">{`THROUGH THE SAME SYNTAX, THIS IS HOW I WOULD HAVE SEEN YOU AS AN EXTRAVERT:`}</a>
      </Card>
      <div className="relative h-[382px] w-full rounded-lg bg-[#333] p-1 uppercase">
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={userData.score as any}
            className="left-[4px] top-[4px] z-10"
          />
        )}
      </div>
      <Card className="flex flex-col items-start justify-start gap-4 p-12">
        <GridDot count={8} />
        <a className="text-base tracking-[2.4px]">{`AND THIS IS HOW I WOULD HAVE SEEN YOU AS SOMEONE EMOTIONAL:`}</a>
      </Card>
      <div className="w-full space-y-1">
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-[20px] leading-[150%] tracking-[3.2px] text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"HOW DOES THIS WORK?"}
          </button>
        </div>
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-[20px] leading-[150%] tracking-[3.2px] text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"WHY DID YOU DO THIS?"}
          </button>
        </div>
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-[20px] leading-[150%] tracking-[3.2px] text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"WHAT ELSE IS THERE?"}
          </button>
        </div>
      </div>
    </div>
  );
}
