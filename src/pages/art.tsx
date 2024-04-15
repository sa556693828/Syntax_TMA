import Card from "@/components/Card";
import Box from "@/components/p5/Art";
import { Context } from "@/components/Provider";
import GridDot from "@/components/ui/gridDot";
import { useBackButton, useMainButton, useViewport } from "@tma.js/sdk-react";
import { useContext, useEffect, useState } from "react";

interface ArtProps {
  userID: string;
  userScore: Array<number>;
}

export default function Art() {
  const backButton = useBackButton();
  const mainButton = useMainButton();
  const { userData, goPage } = useContext(Context);
  const [revealed, setRevealed] = useState(false);

  const onBackButtonClick = () => {
    goPage("/");
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

  // useEffect(() => {
  //   mainButton.enable().show();
  //   return () => {
  //     mainButton.hide();
  //   };
  // }, []);

  // useEffect(() => {
  //   const onMainButtonClick = () => {
  //     if (state === 3) {
  //       goPage("/test");
  //     } else {
  //       setState((prev: any) => prev + 1);
  //     }
  //   };
  //   mainButton.setBackgroundColor("#FFFFFF");
  //   mainButton.setTextColor("#000000");

  //   mainButton.on("click", onMainButtonClick);

  //   return () => {
  //     mainButton.off("click", onMainButtonClick);
  //   };
  // }, [mainButton, state]);
  useEffect(() => {
    setTimeout(() => {
      setRevealed(true);
    }, 4000);
  }, []);

  return (
    <div className="w-full relative p-1 h-full flex items-center justify-between flex-col gap-1">
      <div className="bg-[#333] w-full relative p-1 uppercase rounded-lg h-[374px]">
        {userData && userData.user_id && userData.score && (
          <Box userID={userData.user_id} userScore={userData.score as any} />
        )}
      </div>
      <Card className="flex flex-col items-start justify-start p-12 gap-4">
        <GridDot count={8} />
        <a className="tracking-[2.56px] text-base">{`THIS IS MY INTERPRETATION OF YOUR SYNTAX AS BEING:`}</a>
        <a className="tracking-[2.56px] text-base">
          {`BALANCED INTROVERTED/EXTRAVERTED`}
          {`VERY INTUITIVE`}
          {`EXTREMELY INCLINED TOWARDS THINKING`}
          {`SOMEWHAT LEANING TOWARDS JUDGING`}
          {`EXTREMELY SHAPED BY NURTURE`}
          {`BALANCED PREFERRING STABILITY/SEEKING CHANGE`}
          {`SOMEWHAT PESSIMISTIC`}
          {`VERY FUTURE-ORIENTED`}
        </a>
      </Card>
      <div className="w-full h-[62px]">
        <button
          className="text-[20px] leading-[150%] border w-full h-full rounded-md hover:border-white/20 bg-white hover:bg-white/80 text-blackBg tracking-[3.2px]"
          onClick={() => goPage("/profile")}
        >
          {"NOW WHAT?"}
        </button>
      </div>
    </div>
  );
}
