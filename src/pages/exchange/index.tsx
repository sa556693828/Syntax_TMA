import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";

const transaction = {
  messages: [
    {
      address:
        "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // destination address
      amount: "20000000", //Toncoin in nanotons
    },
  ],
};

export default function Exchange() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();

  // if (!connectionRestored) {
  // return <Loader>Please wait...</Loader>;
  // }

  return (
    <div>
      <TonConnectButton />
      <button
        onClick={() => tonConnectUI.sendTransaction(transaction as any)}
        className="bg-white"
      >
        Send transaction
      </button>
    </div>
  );
}
