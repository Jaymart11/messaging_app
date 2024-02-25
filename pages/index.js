import Head from "next/head";
import dynamic from "next/dynamic";
import "@sendbird/uikit-react/dist/index.css";

const Chat = dynamic(() => import("../components/index"), {
  ssr: false,
  loading: () => <p>...</p>,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>SendBird UIKit with NextJS 13</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Chat />
      </main>
    </>
  );
}
