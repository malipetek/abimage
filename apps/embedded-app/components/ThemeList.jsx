import { Card, ResourceList, Avatar, ResourceItem } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { userLoggedInFetch } from "../App";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";

export function ThemeList() {
  const [themes, setThemes] = useState([]);
  const app = useAppBridge();
  const fetch = userLoggedInFetch(app);

  useEffect(() => {
    (async () => {
      const resp = await fetch("/app/api/themes");
      console.log("resp", resp);
      const themesJson = await resp.json();
      setThemes(themesJson);
    })();
  }, []);
  return (
    <Card>
      <ResourceList
        resourceName={{ singular: "Theme", plural: "Themes" }}
        items={themes}
        renderItem={(theme) => {
          const { id, name } = theme;
          // const media = <Avatar customer size="medium" name={name} />;

          return (
            <ResourceItem
              id={id}
              url={"url"}
              accessibilityLabel={`View details for ${id}`}
            >
              {name} ({id})
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
}
