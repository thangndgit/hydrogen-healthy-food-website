import {useLoaderData} from '@remix-run/react';
import DishGrid from '~/components/DishGrid';
import {strIncludeStandard} from '~/utils/converters';

export async function loader({request, context}) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q');

  const {products} = await context.storefront.query(PRODUCTS_QUERY);

  const filteredProducts = products?.edges?.filter((prod) =>
    strIncludeStandard(prod?.node?.title, searchTerm),
  );

  const suggestProducts = products?.edges?.slice(0, 9);

  return {filteredProducts, suggestProducts};
}

export default function Search() {
  const {filteredProducts, suggestProducts} = useLoaderData();

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4 md:mb-8">
          Tìm thấy {filteredProducts.length} món ăn phù hợp!
        </h1>
        {!!filteredProducts.length && <DishGrid products={filteredProducts} />}
        {!filteredProducts.length && (
          <>
            <span className="text-copy max-w-prose whitespace-pre-wrap">
              Không có kết quả phù hợp!
            </span>
          </>
        )}
      </section>
      {!filteredProducts.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-4">Món ăn nổi bật</h1>
          <DishGrid products={suggestProducts} path="/dishes" />
        </section>
      )}
    </>
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
`;
