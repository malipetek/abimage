import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Page,
  Layout,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

export function Theme() {
  const { id } = useParams();
  const [assets, setAssets] = useState([]);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`/app/api/assets/${id}`);
      console.log("resp", resp);
      const themesJson = await resp.json();
      setAssets(themesJson);
    })();
  }, []);
  return (
    <Page fullWidth title={"Theme"}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <ResourceList
              resourceName={{ singular: "Asset", plural: "Assets" }}
              items={assets || []}
              renderItem={(asset) => {
                const { key } = asset;
                const [folder, filename] = key.split("/");

                if (folder != "assets" || /\.js/.test(filename)) return null;

                return (
                  <ResourceItem
                    id={id}
                    url={"url"}
                    accessibilityLabel={`View details for ${id}`}
                  >
                    {filename}
                  </ResourceItem>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
