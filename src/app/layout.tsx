import { ThemeProvider } from "@mui/material/styles";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";

import getApi from "@/Utils/getApi";

import "./globals.scss";
import "bootstrap/scss/bootstrap.scss";
import "react-toastify/dist/ReactToastify.css";
import theme from "./theme";
import { GlobalProvider } from "./globalProvider";
import { fetchSettingData } from "./fetchFunction";
import { getDictionary } from "../components/Utils/dictionaries";
import { ToastContainer } from "react-toastify";
import Layout1 from "@/components/comingsoon/layout1";
import Script from "next/script";

// const nunito = Nunito({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  // fetch data
  const product = await fetchSettingData();
  const metaValue = product.data.app;
  const metaValueTitle = product.data.site;
  console.log("product", product);
  let title = `${metaValueTitle.titleName}`;
  let description = `${metaValue.desc}`;
  let fimage = `${product.baseurl + metaValue.favicon}`;

  return {
    title,
    description,
    icons: {
      icon: fimage,
    },
    openGraph: {
      title,
      // description,
      siteName: `${metaValue.appName}`, // common for all pages
      images: {
        url: fimage,
        secureUrl: fimage,
        alt: `${metaValue.appName}`,
      }, // common for all pages
      url: `${`${metaValue.baseUrl}`}`, // common for all pages
      locale: "en_US", // common for all pages
      // type: "article" // common for all pages
    },
    other: {
      appname: metaValue.appName,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = cookies().get("app") || { value: "default" };
  const mode1 = headers().get("host");
  const apidata = getApi(mode1 || "default");
  // get settings data
  const res = await fetchSettingData();
  const settings = res.data;
  const favicon = res?.baseurl + settings?.app?.favicon;
  console.log("favicon1234", favicon);
  // settings.dateFormat = settings.hiddenSettings.dateFormat;
  // settings.timeFormat = "h:mm A";
  // get lang data
  const initialLanguage = await fetch(
    `${apidata.live_url}translation/languages/user`,
    { next: { revalidate: 0 } }
  ).then((res) => res.json());
  const defaultLanguage = initialLanguage?.data?.language.find(
    (language: any) => language.default
  );
  const lang = cookies().get("NEXT_LOCALE")
    ? cookies().get("NEXT_LOCALE")
    : { value: defaultLanguage?.indexName };
  const dict = await getDictionary(lang?.value);
  // get currency data
  const initialCurrency = await fetch(
    `${apidata.live_url}Currency/currencies`,
    { next: { revalidate: 0 } }
  ).then((res) => res.json());
  const defaultInitial = initialCurrency?.data?.currency.find(
    (currency: any) => currency.default
  );
  const curr = cookies().get("NEXT_CURRENCY")
    ? cookies().get("NEXT_CURRENCY")
    : { value: defaultInitial.code };
  const currRes = await fetch(
    `${apidata.live_url}Currency/currencies/${curr?.value}`,
    { next: { revalidate: 0 } }
  );
  const currResponse = await currRes.json();
  const newCurrRes = (await currResponse?.data?.currency) || defaultInitial;
  //  {
  //   code: 'EUR',
  //   default: false,
  //   name: 'Euro',
  //   symbol: '€',
  //   exchange_rate: '1',
  // }
  const maintenance = false;
  if (maintenance) {
    return <Layout1 />;
  }
  console.log("settings1111", settings);
  return (
    <html lang="en">
      <head>
        <link
          id="theme-link"
          rel="stylesheet"
          href={`/theme-${settings?.theme?.themeColor}.css`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
        {settings?.google?.searchConsoleVerification && (
          <meta
            name="google-site-verification"
            content={settings.google.searchConsoleVerification}
          />
        )}
        <meta name="application-name" content="Purple9Rooms" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Purple9Rooms" />
        <meta name="description" content="Best PWA App in the world" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        {/* <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />*/}
        {/* <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" /> */}
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" sizes="180x180" href={favicon} />
        <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
        <link rel="icon" type="image/png" sizes="16x16" href={favicon} />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
      </head>
      <body
        style={{
          fontFamily: "var(--font-family-base)",
        }}
      >
        {/* <Provider store={store}>
            {getLayout(<Component {...pageProps} />)}
        </Provider> */}
        <ThemeProvider theme={theme}>
          <GlobalProvider
            settings={settings}
            i18={dict}
            currency={newCurrRes}
            languages={defaultLanguage}
            baseUrl={apidata.base_url}
          >
            {/* <ErrorBoundary> */}
            {children}
            <ToastContainer
              hideProgressBar={true}
              position="bottom-left"
              bodyStyle={{
                bottom: "40px",
                zIndex: 99999,
              }}
            />
            {/* </ErrorBoundary> */}
          </GlobalProvider>
          <Script
            //src="https://www.googletagmanager.com/gtag/js?id=G-WZ877NKGE1"
            src={`https://www.googletagmanager.com/gtag/js?id=${settings?.google?.googleTagId}`}
            strategy="afterInteractive"
            async
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings?.google?.googleTagId}');
    `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}
