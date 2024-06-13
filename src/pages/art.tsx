import Card from "@/components/Card";
import Box from "@/components/p5/Art";
import { Context } from "@/components/Provider";
import GridDot from "@/components/ui/gridDot";
import { useBackButton, useMainButton, useViewport } from "@tma.js/sdk-react";
import React, { useContext, useEffect, useState } from "react";

export default function Art() {
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
        }, i * 2000)
      ); // 每個Card延遲2秒顯示
    }
    return () => {
      timers.forEach((timer: any) => clearTimeout(timer));
    };
  }, []);

  type Strength = 'A LITTLE' | 'SOMEWHAT' | 'PRETTY' | 'VERY';
  type Trait =
    | 'INTROVERTED'
    | 'EXTRAVERTED'
    | 'PRAGMATIC'
    | 'IDEALISTIC'
    | 'RATIONAL'
    | 'EMOTIONAL'
    | 'METHODICAL'
    | 'UNPREDICTABLE'
    | 'INHERENT'
    | 'MOLDED'
    | 'ANCHORING'
    | 'ADAPTABLE'
    | 'PESSIMISTIC'
    | 'OPTIMISTIC'
    | 'RETROSPECTIVE'
    | 'FORWARD-THINKING';

  const traitMappings: Record<number, Trait[]> = {
    1: ['INTROVERTED', 'EXTRAVERTED'],
    2: ['PRAGMATIC', 'IDEALISTIC'],
    3: ['RATIONAL', 'EMOTIONAL'],
    4: ['METHODICAL', 'UNPREDICTABLE'],
    5: ['INHERENT', 'MOLDED'],
    6: ['ANCHORING', 'ADAPTABLE'],
    7: ['PESSIMISTIC', 'OPTIMISTIC'],
    8: ['RETROSPECTIVE', 'FORWARD-THINKING'],
  };

  interface TraitStrength {
    trait: Trait;
    strength: Strength;
  }

  const getStrength = (score: number): Strength => {
    if (score <= 0.1) return 'A LITTLE';
    if (score <= 0.4) return 'SOMEWHAT';
    if (score <= 0.6) return 'PRETTY';
    return 'VERY';
  };

  const [traits, setTraits] = useState<TraitStrength[]>([]);

  useEffect(() => {
    const initialTraits = userData.score.map((score, index) => {
      const traitPair = traitMappings[index + 1];
      const traitValue = score > 0.5 ? traitPair[1] : traitPair[0];
      return {
        trait: traitValue,
        strength: getStrength(score),
      };
    });
    setTraits(initialTraits);
  }, [userData]);

  const interpretation = traits.reduce((acc, trait, index) => {
    const separator = index < traits.length - 1 ? ', ' : '.';
    return `${acc}${trait.strength} <b>${trait.trait}</b>${separator} `;
  }, '');
  const userArg1 = userData.score[0] > 0.5 ? 'INTROVERT' : 'EXTRAVERT';
  const userArg2 = userData.score[2] > 0.5 ? 'EMOTIONAL' : 'RATIONAL';

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between gap-1 p-1">
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
        {traits.length > 0 && (
          <a
            className="text-base tracking-[2.4px]"
            dangerouslySetInnerHTML={{ __html: `THIS IS MY INTERPRETATION OF YOUR SYNTAX AS SOMEONE WHO IS ${interpretation}` }}
          />
        )}
      </Card>
      <div
        className={`relative flex h-[382px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-transparent uppercase delay-1000 duration-1000 hover:opacity-80 ${revealed[2] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={[userData.score[0] > 0.5 ? 0 : 1, ...userData.score.slice(1)]}
            overScreen={true}
          />
        )}
      </div>
      <Card
        className={`flex flex-col items-start justify-start gap-4 p-12 transition-all delay-1000 duration-1000 ${revealed[1] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <GridDot count={8} />
        <a>THROUGH THE SAME SYNTAX, THIS IS HOW I WOULD HAVE SEEN YOU AS AN <b>{userArg1}</b>:</a>
      </Card>
      <div
        className={`relative flex h-[382px] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-lg bg-transparent uppercase delay-1000 duration-1000 hover:opacity-80 ${revealed[2] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        {userData && userData.user_id && userData.score && (
          <Box
            userID={userData.user_id}
            userScore={[...userData.score.slice(0, 2), userData.score[2] > 0.5 ? 0 : 1, ...userData.score.slice(3)]}
            overScreen={true}
          />
        )}
      </div>
      <Card
        className={`flex flex-col items-start justify-start gap-4 p-12 delay-1000 duration-1000 ${revealed[3] ? "opacity-100" : "opacity-0"} ease-in-out`}
      >
        <GridDot count={8} />
        <a>AND THIS IS HOW I WOULD HAVE SEEN YOU AS SOMEONE <b>{userArg2}</b>:</a>
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
