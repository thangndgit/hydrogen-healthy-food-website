import {Link, useLoaderData} from '@remix-run/react';

export async function loader({context}) {
  const collections = await context.storefront.query(COLLECTIONS_QUERY);

  return collections;
}

export default function Category() {
  const {collections} = useLoaderData();

  return (
    <section className="w-[92vw] mx-auto mt-8 text-green-700">
      <h1 className="font-bold text-xl md:text-2xl mb-4 md:mb-8">
        Danh mục đồ ăn
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        {collections?.edges?.map((collection) => (
          <CategoryCard
            collection={collection?.node}
            key={collection?.node?.id}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({collection}) {
  return (
    <Link
      to={`/categories/${collection.handle}`}
      className="flex flex-col gap-3 mt-3 md:mt-0"
    >
      <div
        style={{backgroundImage: `url('${collection?.image?.url}')`}}
        className="card bg-center bg-cover aspect-square rounded-xl"
      />
      <div className="font-semibold text-lg">{collection.title}</div>
    </Link>
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
          image {
            id
            url
          }
        }
      }
    }
  }
`;
