import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { RoutePropagator as AppBridgeRoutePropagator } from "@shopify/app-bridge-react";

function RoutePropagator(props) {
  const { location } = props;
  return <AppBridgeRoutePropagator location={location} />;
}

export default withRouter(RoutePropagator);
