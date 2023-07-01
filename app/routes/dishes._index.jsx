import {useLoaderData} from '@remix-run/react';
import DishGrid from '~/components/DishGrid';

export function meta() {
  return [
    {title: 'Danh sách sản phẩm'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export async function loader({context}) {
  const collections = await context.storefront.query(COLLECTIONS_QUERY);
  return {collections: collections.collections.edges};
}

export default function Dish() {
  const {collections} = useLoaderData();

  return (
    <>
      {collections?.map((collection) => (
        <section
          className="w-[92vw] mx-auto mt-8 text-green-700"
          key={collection?.node?.handle}
          id={collection?.node?.handle}
        >
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            {collection?.node?.title}
          </h1>
          {!collection?.node?.products?.edges?.length && (
            <div>Hiện chưa có sản phẩm nào</div>
          )}
          {!!collection?.node?.products?.edges?.length && (
            <DishGrid products={collection?.node?.products?.edges} />
          )}
        </section>
      ))}
    </>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query {
    collections(first:20) {
      edges {
        node {
          id
          title
          handle
          products(first:100) {
            edges {
              node {
                id
                title
                featuredImage {
                  id
                  url
                }
                handle
                priceRange{
                  minVariantPrice{
                    amount
                    currencyCode
                  }
                  maxVariantPrice{
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
    }
  }
`;
