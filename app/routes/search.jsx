import {useLoaderData} from '@remix-run/react';
import DishGrid from '~/components/DishGrid';

export async function loader({context}) {
  const {products} = await context.storefront.query(PRODUCTS_QUERY);

  return products;
}

export default function Search() {
  const products = useLoaderData();

  return (
    <section className="w-[92vw] mx-auto mt-8 text-green-700">
      <h1 className="font-bold text-xl md:text-2xl mb-4 md:mb-8">
        Kết quả tìm kiếm
      </h1>
      <DishGrid products={products.edges} />
    </section>
  );
}

const PRODUCTS_QUERY = `#graphql
  query {
    products(first: 250) {
      edges {
        node {
          id
          title
          featuredImage {
            id
            url
          }
          handle
          priceRange {
            minVariantPrice {
              amount
            }
            maxVariantPrice {
              amount
            }
          }
          totalInventory
        }
      }
    }
  }
`;
