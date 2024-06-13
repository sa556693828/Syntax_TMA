import { useCallback, useContext, useEffect, useState } from "react";
import GridDot from "@/components/ui/gridDot";

interface ExpandButtonProps {
    title: string;
    content: string | JSX.Element;
    index: number;
    openArr: Array<boolean>;
    close: boolean;
    onClick: () => void;
}

export default function ExpandButton({ title, content, index, onClick, openArr, close }: ExpandButtonProps) {
    return (
        <div
            onClick={onClick}
            className={`whitespace-pre-wrap flex flex-col gap-4 p-12 transition-all ease-in-out w-full rounded-lg text-black uppercase
            ${openArr[index] ? "bg-greyBg h-fit flex-1 text-[14px] overflow-auto tracking-[2.24px] leading-[150%]" : "cursor-pointer bg-white text-lg items-center justify-center"}
            ${openArr.includes(true) ? "h-[62px]" : "h-full"}
            `}>
            {openArr[index] && <GridDot count={8} />}
            {openArr[index] ? content : title}
        </div>
    );
}
