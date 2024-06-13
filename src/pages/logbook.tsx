import { useCallback, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import ExpandButton from "@/components/ui/expandButton";
import INTROVERSION from '@/assets/logBook/1-1_INTROVERSION.png'
import EXTRAVERSION from '@/assets/logBook/1-2_EXTRAVERSION.png'
import SENSING from '@/assets/logBook/2-1_SENSING.png'
import INTUITION from '@/assets/logBook/2-2_INTUITION.png'
import THINKING from '@/assets/logBook/3-1_THINKING.png'
import FEELING from '@/assets/logBook/3-2_FEELING.png'
import JUDGING from '@/assets/logBook/4-1_JUDGING.png'
import PERCEIVING from '@/assets/logBook/4-2_PERCEIVING.png'
import NATURE from '@/assets/logBook/5-1_NATURE.png'
import NURTURE from '@/assets/logBook/5-2_NURTURE.png'
import STABILITY from '@/assets/logBook/6-1_STABILITY.png'
import CHANGE from '@/assets/logBook/6-2_CHANGE.png'
import PESSIMISM from '@/assets/logBook/7-1_PESSIMISM.png'
import OPTIMISM from '@/assets/logBook/7-2_OPTIMISM.png'
import PAST from '@/assets/logBook/8-1_PAST.png'
import FUTURE from '@/assets/logBook/8-2_FUTURE.png'

export default function Logbook() {
  const router = useRouter();
  const [openArr, setOpenArr] = useState([
    false,
    false,
    false,
  ])
  const imgArr = [
    { title: "INTROVERSION", img: INTROVERSION },
    { title: "EXTRAVERSION", img: EXTRAVERSION },
    { title: "SENSING", img: SENSING },
    { title: "INTUITION", img: INTUITION },
    { title: "THINKING", img: THINKING },
    { title: "FEELING", img: FEELING },
    { title: "JUDGING", img: JUDGING },
    { title: "PERCEIVING", img: PERCEIVING },
  ]
  const imgArr2 = [
    { title: "NATURE", img: NATURE },
    { title: "NURTURE", img: NURTURE },
    { title: "STABILITY", img: STABILITY },
    { title: "CHANGE", img: CHANGE },
    { title: "PESSIMISM", img: PESSIMISM },
    { title: "OPTIMISM", img: OPTIMISM },
    { title: "PAST", img: PAST },
    { title: "FUTURE", img: FUTURE },
  ]

  const content = {
    story: "THROUGHOUT HISTORY, PHILOSOPHERS HAVE PONDERED OVER WHAT MAKES US, US. IS IT OUR ACTIONS, OUR MEMORIES, OUR POSSESSIONS? SYNTAX ISN'T ABOUT ANSWERS; IT'S ABOUT PERSPECTIVES. HERE, IDENTITY IS FILTERED THROUGH THE LENS GENERATIVE ART, ROOTED IN SELF-ANALYSIS OF PERSONALITY AND PHILOSOPHY. THE GOAL IS NOT TO PROVIDE A DEFINITIVE ANSWER BUT TO PROVOKE THOUGHT, TO INSPIRE REFLECTION ON A DIFFERENT INTERPRETATION OF IDENTITY.\n\nIN THE DIGITAL AGE, WHERE OUR LIVES ARE INCREASINGLY PUBLIC, THERE'S A GROWING NEED TO REDEFINE IDENTITY. THIS PROJECT IS AN EXPLORATION OF WHAT IDENTITY COULD MEAN WHEN WE STRIP AWAY THE USUAL MARKERS—NAMES, FACES, JOBS. IT'S ABOUT FINDING A NEW KIND OF SOCIAL IDENTITY, ONE THAT'S DEEPLY PERSONAL YET UNIVERSALLY UNDERSTOOD, BUILT ON THE ETHOS OF BRIDGING PRIVACY AND INTIMACY.\n\nTHE ARTWORK IS DESIGNED TO GIVE AN INTUITIVE SENSE OF CHARACTER WHILE CHALLENGING OBSERVERS TO DISCERN THE UNDERLYING TRAITS REPRESENTED. UNDERSTANDING THESE TRAITS, MUCH LIKE UNDERSTANDING PEOPLE, REQUIRES TIME AND INSIGHT.\n\nTHERE ARE MANY INTERPRETATIONS OF IDENTITY, AND EVEN MORE ARTISTIC WAYS TO VISUALIZE IT. I HOPE MY ARTWORK WILL BE AT THE FOREFRONT OF SEPARATING IDENTITY FROM PRIVATE INFORMATION. IT'S AN OPEN INVITATION TO DISCUSS WHAT IDENTITY MEANS TODAY AND TO VENTURE INTO NEW TERRITORIES OF SELF-EXPRESSION.",
    key:
      (<div className="flex flex-col gap-4">
        {`SYNTAX DRAWS ITS THEMATIC AND VISUAL INSPIRATION FROM LEONARDO DA VINCI’S VITRUVIAN MAN, A STUDY THAT ELEGANTLY LINKS HUMAN FORM TO UNIVERSAL HARMONIES. IN SYNTAX, THIS CONNECTION IS TWOFOLD: THROUGH THE EXPLORATION OF HUMAN ESSENCE VIA A QUESTIONNAIRE AND THROUGH THE USE OF GEOMETRIC ELEMENTS—SQUARES, CIRCLES, AND LINES—THAT NOT ONLY ECHO THE VITRUVIAN MAN’S METHOD BUT ALSO VISUALLY SIMULATE THE COSMOS.\n\nTHE FIRST FOUR QUESTIONS OF THE SYNTAX QUESTIONNAIRE FOCUS ON PERSONALITY TRAITS, VISUALLY REPRESENTED THROUGH AN ARRANGEMENT OF 16 DOTS. THIS DESIGN IS INSPIRED BY THE 16 MBTI RESULTS AND THE 16 PERSONALITY FACTOR QUESTIONNAIRE, WHICH BOTH CORRELATE PERSONALITY WITH THE NUMBER 16. EACH DOT ARRANGEMENT INTUITIVELY SYMBOLIZES DISTINCT PERSONALITY TRAITS, BUT WHEN OVERLAID, THEY CREATE A COMPLEX, INTERCONNECTED VISUAL, REFLECTING THE MULTIFACETED NATURE OF HUMAN PERSONALITY.`}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          {imgArr.map((img, i) => (
            <div key={i} className="flex flex-col gap-2 items-center">
              <Image src={img.img} alt={img.title} width={200} height={200} className='rounded' />
              <a className="text-[14px] leading-[150%] tracking-[2.24px] font-bold">{img.title}</a>
            </div>
          ))}
        </div>
        {`THE LATTER FOUR QUESTIONS IN THE SYNTAX QUESTIONNAIRE PROBE INTO THE PHILOSOPHICAL BELIEFS THAT I BELIEVE DEEPLY INFORM AN INDIVIDUAL’S IDENTITY. THE RESPONSES TO THESE QUESTIONS DYNAMICALLY INFLUENCE THE ARTWORK'S BACKGROUND, DEPICTED THROUGH FLOWING DOTS. SIMILAR TO DISCERNING A PERSON’S PHILOSOPHICAL VALUES IN REAL LIFE, THESE DOTS GRADUALLY REVEAL THEIR FULL PATTERN OVER TIME, SYMBOLIZING HOW SUCH DEEP-SEATED BELIEFS OFTEN BECOME APPARENT ONLY THROUGH PROLONGED INTERACTION AND REFLECTION.`}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          {imgArr2.map((img, i) => (
            <div key={i} className="flex flex-col gap-2 items-center">
              <Image src={img.img} alt={img.title} width={200} height={200} className='rounded' />
              <a className="text-[14px] leading-[150%] tracking-[2.24px] font-bold">{img.title}</a>
            </div>
          ))}
        </div>
      </div>),
    void: `"THE VOID" SERVES AS A UNIQUE EXTENSION OF THE INTROSPECTIVE JOURNEY THAT SYNTAX FACILITATES. THIS FEATURE OF SYNTAX IS DESIGNED TO DEEPEN USERS' ENGAGEMENT WITH THEIR OWN IDENTITIES THROUGH A REFLECTIVE PROCESS OF QUESTIONING AND ANSWERING. EACH DAY, USERS ARE INVITED TO CONTRIBUTE ONE QUESTION TO THE VOID AND IN TURN, EXPLORE ONE POSED BY OTHERS. THIS INTERACTION IS DEVOID OF STAKES, AS QUESTIONS ARE RELEASED INTO THE METAPHORICAL VOID, FOSTERING AN ENVIRONMENT OF PURE CONTEMPLATION WITHOUT EXTERNAL PRESSURES.\n\nTHIS COMPONENT OF SYNTAX DELIBERATELY CONTRASTS WITH TYPICAL SOCIAL MEDIA INTERACTIONS, WHICH OFTEN FOCUS ON RAPID CONSUMPTION AND RESPONSE TO EXTERNAL CONTENT. INSTEAD, THE VOID OFFERS A SPACE TO PAUSE AND ENGAGE WITH ONE'S OWN THOUGHTS, PROVIDING A MOMENT OF RESPITE AND SELF-REFLECTION. IT ENCOURAGES USERS TO "PLAY" WITH THEIR OWN MINDS, EXPLORING THOUGHTS AND QUESTIONS THAT RESONATE ON A PERSONAL LEVEL, THEREBY ENRICHING THEIR UNDERSTANDING OF THEMSELVES AND THEIR PLACE IN THE WORLD.`
  }
  const bookArr = [
    { title: "The Story", key: 'story', content: content.story },
    { title: "Syntax Key", key: 'key', content: content.key },
    { title: "The Void", key: 'void', content: content.void }
  ]

  const handleExpand = (index: number) => {
    setOpenArr(openArr.map((item, i) => (i === index ? !item : false)));
  };

  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-between gap-1 p-1 bg-black">
      <div className="z-20 flex h-24 w-full flex-shrink-0 items-center justify-center bg-transparent px-6 text-lg">
        <FaArrowLeftLong
          size={20}
          onClick={() => router.back()}
          className="absolute left-6 cursor-pointer hover:opacity-60"
        />
        <a className="text-nowrap">THE LOGBOOK</a>
      </div>
      {bookArr.map((item, index) => (
        <ExpandButton key={index} title={item.title} onClick={() => handleExpand(index)} content={item.content} close={false} index={index} openArr={openArr} />
      ))}
    </div>
  );
}
