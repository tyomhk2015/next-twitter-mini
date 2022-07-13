import { SWRConfig } from "swr";
import "../global.css";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((response) => response.json())
      }}
    >
      <div className={`min-w-[280px] max-w-xl mx-auto sm:border-r sm:border-l border-gray-500 min-h-[100vh] overflow-y-auto`}>
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}
