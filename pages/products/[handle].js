// include apollo
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
// import Shopify Polaris components
import { Page } from "@shopify/polaris";

const PRODUCT_QUERY = gql`
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      description
      title
      tags
      variants(first: 10) {
        edges {
          node {
            displayName
          }
        }
      }
    }
  }
`;

// react component rendering the product details
const Product = (props) => {
  const { router } = props;
  const { handle } = router.query;
  const { loading, error, data } = useQuery(PRODUCT_QUERY, {
    variables: {
      handle,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error :(</div>;

  return (
    <Page
      breadcrumbs={[
        { content: "home", url: "/" },
        { content: "products", url: "/products" },
      ]}
    >
      <h1>{data.productByHandle.title}</h1>
      <p>{data.productByHandle.description}</p>
    </Page>
  );
};

export default Product;
