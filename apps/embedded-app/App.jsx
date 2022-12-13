import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  Provider as AppBridgeProvider,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import {
  AppProvider as PolarisProvider,
  Frame
} from "@shopify/polaris";

import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Link from "./components/Link";
import SaveBar from "./components/SaveBar";

import { HomePage } from "./routes/HomePage";
import { Theme } from "./routes/Theme";

import { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux'
import store from './store/store'

export default function App() {
  return (
    <PolarisProvider i18n={translations} linkComponent={Link}>
      <BrowserRouter>
        <AppBridgeProvider
          config={{
            apiKey: process.env.SHOPIFY_API_KEY,
            host: new URL(location.href).searchParams.get("host"),
            forceRedirect: true,
          }}
        >
          <ReduxProvider store={store}>
            <MyProvider>
              <Frame
              // logo={logo}
              // topBar={topBarMarkup}
              // navigation={navigationMarkup}
              // showMobileNavigation={mobileNavigationActive}
              // onNavigationDismiss={toggleMobileNavigationActive}
              // skipToContentTarget={skipToContentRef.current}
              >
                <SaveBar />
                <Routes>
                  <Route path="/app/" element={<HomePage />} />
                  <Route path="/app/theme/:id" element={<Theme />} />
                </Routes>
              </Frame>
            </MyProvider>
          </ReduxProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

function MyProvider({ children }) {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      credentials: "include",
      fetch: userLoggedInFetch(app),
    }),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
