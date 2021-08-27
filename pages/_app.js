import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import App from "next/app";
import { AppProvider, Frame, Navigation, TopBar, Link } from "@shopify/polaris";
import { HomeMajor, OrdersMajor, ProductsMajor } from "@shopify/polaris-icons";
import { Provider, useAppBridge, TitleBar } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { useState, useEffect } from "react";
import NextLink from "next/link";
// import { useRouter } from 'next/router'
import "../lib/styles.css";
import RoutePropagator from "../components/RoutePropagator.js";

function userLoggedInFetch(app) {
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
function ProvidersWrapper({ children, ...props }) {
  const { router, host: hostp } = props;

  const [host, setHost] = useState(hostp);

  useEffect(() => {
    const url = new URL(window.location.href);
    const host = url.searchParams.get("host");

    // If host is not set, than the page is being loaded outside of App Bridge
    // so we should proceed with starting OAuth
    if (host) {
      setHost(host);
    } else {
      window.location.pathname = `/api/auth/shopify/login`;
    }
  }, []);

  // --- Prepare breadcrumbs ---
  const routes = router.route
    .split("/")
    .filter(Boolean)
    .map((route) => {
      // check if the route is a slug
      const isSlug = /\[[^\]]+\]/.test(route);

      if (!isSlug) return route;

      const slug = route.replace(/\[|\]/g, "");

      return router.query[slug] || "slug not found";
    });
  const currentRoute = routes[routes.length - 1];
  const routesExceptLast = routes.slice(0, routes.length - 1);
  // --- End Prepare breadcrumbs ---

  const Component = props.Component;

  return (
    <AppProvider linkComponent={RouterLink} i18n={translations}>
      <Provider
        config={{
          apiKey: API_KEY,
          host: host,
          forceRedirect: false,
        }}
      >
        <TitleBar
          title={currentRoute}
          breadcrumbs={
            routesExceptLast.length
              ? routesExceptLast.map((route) => ({
                  content: route,
                  url: `/${route}`,
                }))
              : null
          }
        />
        {children}
      </Provider>
    </AppProvider>
  );
}
function MyProvider(props) {
  const { router, host: hostp } = props;
  const app = useAppBridge();
  const [showNavigationActive, setShowNavigationActive] = useState(false);
  const [showNavigationToggle, setShowNavigationToggle] = useState(false);

  const toggleMobileNavigationActive = () =>
    setShowNavigationActive(!showNavigationActive);

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Frame
        showMobileNavigation={showNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
        topBar={
          <TopBar
            showNavigationToggle
            onNavigationToggle={toggleMobileNavigationActive}
          />
        }
        navigation={
          <Navigation location={router.route}>
            <Navigation.Section
              items={[
                {
                  selected: router.route == "/",
                  url: "/",
                  label: "Home",
                  icon: HomeMajor,
                  exactMatch: true,
                },
                {
                  selected: router.route == "/orders",
                  url: "/orders",
                  label: "Orders",
                  icon: OrdersMajor,
                  badge: "1",
                },
                {
                  selected: router.route == "/products",
                  url: "/products",
                  label: "Products",
                  icon: ProductsMajor,
                },
              ]}
            />
          </Navigation>
        }
      >
        <Component {...props} />
      </Frame>
    </ApolloProvider>
  );
}

function RouterLink({ children, url = "", ...rest }) {
  // Use an regular a tag for external and download links
  // if (isOutboundLink(url) || rest.download) {
  //   return (<a href={url} {...rest}>{children}</a>);
  // }
  return (
    <NextLink href={url} {...rest}>
      <a className={`${rest.className}`}>{children}</a>
    </NextLink>
  );
}

function isOutboundLink(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/.test(url);
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host, router } = this.props;

    return (
      <ProvidersWrapper {...pageProps} router={router} host={host}>
        <MyProvider
          Component={Component}
          {...pageProps}
          router={router}
          host={host}
        />
      </ProvidersWrapper>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
