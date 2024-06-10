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
  const [revealed, setRevealed] = useState([false, false, false, false, false]);

  useEffect(() => {
    const timers: any = [];
    for (let i = 0; i < revealed.length; i++) {
      timers.push(
        setTimeout(() => {
          setRevealed((prev) => {
            const newRevealed = [...prev];
            newRevealed[i] = true;
            return newRevealed;
          });
        }, i * 2000),
      ); // 每個Card延遲2秒顯示
    }
    return () => {
      timers.forEach((timer: any) => clearTimeout(timer));
    };
  }, []);
  useEffect(() => {
    console.log("revealed", revealed);
  }, [revealed]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-1 p-1">
      {/* {userData && userData.user_id && userData.score && (
        <Box
          userID={userData.user_id}
          userScore={userData.score as any}
          className="left-[4px] top-[4px] z-10"
        />
      )} */}
      <div className="relative flex h-[382px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-transparent uppercase hover:opacity-80">
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={userData.score as any}
            overScreen={true}
          />
        )}
      </div>
      <Card
        className={`flex flex-col items-start justify-start gap-4 p-12 transition-all delay-1000 duration-1000 ${revealed[0] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <GridDot count={8} />
        <a className="text-base tracking-[2.56px]">{`THIS IS MY INTERPRETATION OF YOUR SYNTAX AS SOMEONE WHO IS A TAD INTROVERTED, PRETTY INTUITIVE, VERY RATIONAL, SOMEWHAT JUDGING, ENVIRONMENT-NURTURED, A TAD CHANGE SEEKING, PESSIMISTIC, AND FUTURE-ORIENTED.`}</a>
      </Card>
      <Card
        className={`flex flex-col items-start justify-start gap-4 p-12 transition-all delay-1000 duration-1000 ${revealed[1] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <GridDot count={8} />
        <a className="text-base tracking-[2.4px]">{`THROUGH THE SAME SYNTAX, THIS IS HOW I WOULD HAVE SEEN YOU AS AN EXTRAVERT:`}</a>
      </Card>
      <div
        className={`relative flex h-[382px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-transparent uppercase delay-1000 duration-1000 hover:opacity-80 ${revealed[2] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={userData.score as any}
            overScreen={true}
          />
        )}
      </div>
      <Card
        className={`flex flex-col items-start justify-start gap-4 p-12 delay-1000 duration-1000 ${revealed[3] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <GridDot count={8} />
        <a className="text-base tracking-[2.4px]">{`AND THIS IS HOW I WOULD HAVE SEEN YOU AS SOMEONE EMOTIONAL:`}</a>
      </Card>
      <div
        className={`w-full space-y-1 delay-1000 duration-1000 ${revealed[4] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"HOW DOES THIS WORK?"}
          </button>
        </div>
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"WHY DID YOU DO THIS?"}
          </button>
        </div>
        <div className="h-[62px] w-full">
          <button
            className="h-full w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
            onClick={() => goPage("/")}
          >
            {"WHAT ELSE IS THERE?"}
          </button>
        </div>
      </div>
    </div>
  );
}
