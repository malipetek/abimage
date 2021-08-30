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
import { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { parseGid } from "@shopify/admin-graphql-api-utilities";

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

const Products = ({ apiFetch }) => {
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

  useEffect(() => {
    if (data && data.products.edges) {
      (async () => {
        const id = parseGid(data.products.edges[0].node.id);
        const productsRequest = await apiFetch(`/rest/products/${id}`, {
          method: "GET",
          credentials: "same-origin",
          headers: {
            accept: "*/*",
            contentType: "application/json",
          },
        });
        const productData = await productsRequest.json();
        console.log("productsRequest ", productsRequest, productData);
      })();
    }
  }, [data]);

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

export default Products;
