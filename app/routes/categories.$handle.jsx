import {useLoaderData} from '@remix-run/react';
import DishGrid from '~/components/DishGrid';

export function meta() {
  return [
    {title: 'Danh mục sản phẩm'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export async function loader({params, context}) {
  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: params.handle,
    },
  });
  return {
    collection,
  };
}

export default function CategoryHandle() {
  const {collection} = useLoaderData();

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">
          {collection?.title}
        </h1>
        <p className="font-semibold mb-8 md:max-w-[50%]">
          {collection?.description}
        </p>
        {!collection?.products?.edges?.length && (
          <div>Hiện chưa có sản phẩm nào</div>
        )}
        {!!collection?.products?.edges?.length && (
          <DishGrid products={collection?.products?.edges} />
        )}
      </section>
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query ($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 100) {
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
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            totalInventory
          }
        }
      }
    }
  }
`;
