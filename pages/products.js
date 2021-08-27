import {
  Heading,
  Page,
  ResourceList,
  ResourceItem,
  Card,
  TextStyle,
} from "@shopify/polaris";
import Link from "next/link";
import { render } from "react-dom";
import { useState } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import React from "react";

const product_query = gql(`{
  products(first: 10) {
    edges {
      node {
        id
        handle
        title
        priceRangeV2 {
          maxVariantPrice{
            amount
            currencyCode
          }
        }
      }
    }
  }
}`);

const Index = () => {
  const [filter, setFilter] = useState(false);
  const { loading, data, error } = useQuery(product_query);

  const renderItem = (edge) => {
    const product = edge.node;
    const { id, handle, title, priceRangeV2 } = product;

    const price = priceRangeV2.maxVariantPrice.amount;

    return (
      <ResourceItem
        id={id}
        url={`/products/${handle}`}
        // media={media}
        accessibilityLabel={`View details for ${title}`}
      >
        <>
          <h3>
            <TextStyle variation="strong">{handle}</TextStyle>
          </h3>
          <div>{price}</div>
        </>
      </ResourceItem>
    );
  };

  if (error) return `Error! ${error.message}`;

  return (
    <Page
      // primaryAction={
      //   {
      //     content: 'Save',
      //     disabled: true
      //   }
      // }
      breadcrumbs={[{ content: "home", url: "/" }]}
    >
      <Card>
        <ResourceList
          loading={loading}
          resourceName={{ singular: "product", plural: "products" }}
          items={data ? data.products.edges : []}
          renderItem={renderItem}
        />
      </Card>
    </Page>
  );
};

export default Index;
