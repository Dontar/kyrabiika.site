import "../styles/global.scss";

import type { AppProps } from "next/app";
import { SSRProvider } from "@react-aria/ssr";
import reportWebVitals from "../lib/utils/ReportWebVitals";
import { OrderContext } from "../lib/comps/OrderContext";
import { useRouter } from "next/router";
import NProgress from "nprogress";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  NProgress.configure({ showSpinner: false });

  router.events?.on("routeChangeStart", () => {
    NProgress.start();;
  });

  router.events?.on("routeChangeComplete", () => {
    NProgress.done();
  });

  router.events?.on("routeChangeError", () => {
    NProgress.done();
  });


  return (
    <SSRProvider>
      <OrderContext>
        <Component {...pageProps} />
      </OrderContext>
    </SSRProvider>
  );
}

export default MyApp;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
