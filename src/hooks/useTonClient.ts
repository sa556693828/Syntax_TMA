import { useInit } from "./useInit";
import { useTonConnect } from "./useTonConnect";
import { TonClient4 } from "@ton/ton";

export function useTonClient() {
  const { network } = useTonConnect();

  return {
    client: useInit(async () => {
      if (!network) return;
      return new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com",
      });
    }, [network]),
  };
}
