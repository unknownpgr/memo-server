import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../layout";
import { config } from "telefunc/client";

const isBrowser = typeof window !== "undefined";
if (isBrowser) {
  config.telefuncUrl = "/api/_telefunc";
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
