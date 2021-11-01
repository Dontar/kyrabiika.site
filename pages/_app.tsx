import '../styles/global.scss'
import type { AppProps } from 'next/app'
import reportWebVitals from '../lib/ReportWebVitals';
import { OrderContext } from '../lib/OrderContext';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <OrderContext>
      <Component {...pageProps} />
    </OrderContext>
  );
}

export default MyApp

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
