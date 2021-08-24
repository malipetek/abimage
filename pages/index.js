import { Heading, Page } from "@shopify/polaris";
import Link from "next/link";

const Index = () => (
  <Page>
    <Heading>Shopify app with Node and React 🎉</Heading>
    <Link href="/products"> Products </Link>
  </Page>
);

export default Index;
