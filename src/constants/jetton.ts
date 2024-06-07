import { buildOnchainMetadata } from "@/utils/jetton-helpers";

export const jettonParams = {
  name: "Test Token Jetton",
  description: "This is description of Test Jetton Token in Tact-lang Syntax",
  symbol: "TEST",
  image: "https://syntax-tma.vercel.app/jetton.svg",
};
// Create content Cell
export let jettonContent = buildOnchainMetadata(jettonParams);
