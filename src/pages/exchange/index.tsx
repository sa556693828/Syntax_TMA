import { Context } from "@/components/Provider";
import { useBackButton } from "@tma.js/sdk-react";
import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useContext, useEffect } from "react";

const transaction = {
  messages: [
    {
      address:
        "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
      amount: "20000000", //Toncoin in nanotons
    },
  ],
};
const myTransaction = {
  validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
  messages: [
    {
      address: "EQBBJBB3HagsujBqVfqeDUPJ0kXjgTPLWPFFffuNXNiJL0aA",
      amount: "20000000",
      // stateInit: "base64bocblahblahblah==" // just for instance. Replace with your transaction initState or remove
    },
    {
      address: "EQDmnxDMhId6v1Ofg_h5KR5coWlFG6e86Ro3pc7Tq4CA0-Jn",
      amount: "60000000",
      // payload: "base64bocblahblahblah==" // just for instance. Replace with your transaction payload or remove
    },
  ],
};

export default function Exchange() {
  const { goPage } = useContext(Context);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();
  const rawAddress = useTonAddress(false);
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const backButton = useBackButton();
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
  // if (!connectionRestored) {
  // return <Loader>Please wait...</Loader>;
  // }

  return (
    <div className="relative z-20 flex h-[100dvh] w-full flex-col items-center gap-1 bg-black">
      <TonConnectButton />
      <button
        onClick={() => tonConnectUI.sendTransaction(transaction as any)}
        className="bg-white"
      >
        Send transaction
      </button>
      {userFriendlyAddress && (
        <div className="flex w-full flex-wrap">
          <span className="text-white">
            User-friendly address: {userFriendlyAddress}
          </span>
          <span className="text-white">Raw address: {rawAddress}</span>
        </div>
      )}
    </div>
  );
}
