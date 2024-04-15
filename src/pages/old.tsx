import { useContext } from "react";
import { UserData } from "@/types/types";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Context } from "@/components/Provider";

export default function Home() {
  const { userTG, userData, goPage } = useContext(Context);

  const displayOrder: (keyof UserData)[] = [
    "user_id",
    "username",
    "first_name",
    "last_name",
  ];

  return (
    <div className="w-full py-4 flex items-center flex-col gap-4">
      <div className="w-full flex justify-center">
        <a className="text-2xl font-semibold text-center">
          Hello {userTG?.username ? userTG?.username : userTG?.firstName}
        </a>
      </div>
      <div className="flex w-full px-4 pb-4 justify-center gap-4">
        <TonConnectButton className="w-1/2" />
      </div>
      {displayOrder.map((key, index) => {
        if (key === "score" || key === "recaptcha") {
          return null;
        }
        return (
          <div
            key={key}
            className={`w-5/6 flex items-center ${
              index !== displayOrder.length - 1 ? "border-b" : ""
            } pb-2 border-neutral-600 justify-between`}
          >
            <a className="text-lg w-40">{key}:</a>
            <input
              className="bg-transparent text-end border border-neutral-700 w-full px-2 text-lg"
              value={userData?.[key as keyof UserData] as any}
            />
          </div>
        );
      })}
      <div className="w-full flex gap-4 px-4 pb-4">
        {userData.score === null ? (
          <button
            className="text-lg border w-full h-12 rounded-full hover:border-white/20 bg-white hover:bg-transparent hover:text-white text-blackBg"
            onClick={() => goPage("/test")}
          >
            Start a test
          </button>
        ) : (
          <button
            className="text-lg border w-full h-12 rounded-full hover:bg-cyan-600 bg-white hover:text-white text-blackBg"
            onClick={() => goPage("/art")}
          >
            Go to your Art
          </button>
        )}
      </div>
    </div>
  );
}
