import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import type { Metadata } from "next";
// import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { Provider } from "@/components/Provider";
import Layout from "@/components/Layout/Layout";
import { TmaSDKLoader } from "@/components/TmaSDKLoader";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* TODO: 改成自己的 */}
      {/* <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json"> */}
      <TmaSDKLoader>
        <Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </TmaSDKLoader>
      {/* </TonConnectUIProvider> */}
    </>
  );
}
