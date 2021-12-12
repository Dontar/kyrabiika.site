import "../styles/global.scss";
// import "react-image-crop/dist/ReactCrop.css";

import type { AppProps } from "next/app";
import { SSRProvider } from "@react-aria/ssr";
import reportWebVitals from "../lib/utils/ReportWebVitals";
import { OrderContext } from "../lib/comps/OrderContext";


function MyApp({ Component, pageProps }: AppProps) {
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
