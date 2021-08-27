// MyRouter.tsx
import React from "react";
import { withRouter } from "react-router";
import { useClientRouting } from "@shopify/app-bridge-react";

function MyRouter(props) {
  const { history } = props;

  useClientRouting(history);

  return null;
}

export default withRouter(ClientRouter);
