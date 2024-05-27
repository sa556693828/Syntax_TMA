import { Context } from "@/components/Provider";
import { useBackButton } from "@tma.js/sdk-react";
import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
  CHAIN,
} from "@tonconnect/ui-react";
import { useContext, useEffect } from "react";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import TonWeb from "tonweb";
import nacl from "tweetnacl";

const Mainnet = "https://toncenter.com/api/v2/jsonRPC";
const Testnet = "https://testnet.toncenter.com/api/v2/jsonRPC";

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

export default async function Exchange() {
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
  // You can get HTTP API key at https://toncenter.com
  // You can run your own HTTP API instance https://github.com/toncenter/ton-http-api
  const tonweb = new TonWeb(
    new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
      apiKey: "YOUR_TESTNET_API_KEY",
    }),
  );
  // const client = new TonClient({
  //   endpoint: Testnet,
  // });

  // new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_MAINNET_API_KEY'})) :
  // new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC', {apiKey: 'YOUR_TESTNET_API_KEY'}));

  const MY_WALLET_ADDRESS = "UQD6mORg_6kpV0rIS7XMGDBW0D3qWk2JtW5v8xH9fyAQoPMB"; // your HOT wallet
  const TMT_ADDRESS = "EQBSJTSGkwRdlnz8bmmg0IL-YU8K4kqzLzIwGGWNNz8Z4rds"; // TMT token address
  const JETTONS_INFO = {
    jUSDC: {
      address: "EQB-MPwrd1G6WKNkLz_VnV6WqBDd142KMQv-g1O-8QUA3728",
      decimals: 6,
    },
    KOTE: {
      address: "EQBlU_tKISgpepeMFT9t3xTDeiVmo25dW_4vUOl6jId_BNIj",
      decimals: 9,
    },
    TMT: {
      address: TMT_ADDRESS,
      decimal: 9,
    },
  };

  const senderPrivateKey = TonWeb.utils.base64ToBytes("YOUR_PRIVATE_KEY"); // 請使用實際的私鑰
  const senderWallet = tonweb.wallet.create({
    publicKey: TonWeb.utils.nacl.sign.keyPair.fromSecretKey(senderPrivateKey),
  });
  const recipientAddress = "RECIPIENT_ADDRESS"; // 接收者的地址

  const createWallet = async () => {
    const keyPair = TonWeb.utils.nacl.sign.keyPair();
    const publicKey = keyPair.publicKey;
    const publicKeyHex = Buffer.from(publicKey).toString("hex");
    const privateKey = keyPair.secretKey;
    const privateKeyHex = Buffer.from(privateKey).toString("hex");
    const wallet = tonweb.wallet.create({ publicKey });
    const walletAddress = (await wallet.getAddress()).toString(
      true,
      true,
      true,
    );

    console.log("Wallet address:", walletAddress);
    console.log("Public key (hex):", publicKeyHex);
    console.log("Private key (hex):", privateKeyHex);
  };

  useEffect(() => {
    createWallet();
  }, []);

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
      {/* <TonConnectButton /> */}
      {/* <button
        onClick={() => tonConnectUI.sendTransaction(transaction as any)}
        className="bg-white"
      >
        Send transaction
      </button> */}
      {/* {userFriendlyAddress && (
        <div className="flex w-full flex-wrap">
          <span className="text-white">
            User-friendly address: {userFriendlyAddress}
          </span>
          <span className="text-white">Raw address: {rawAddress}</span>
        </div>
      )} */}
    </div>
  );
}
