import {Link, useLoaderData} from '@remix-run/react';
import {fieldsToObject} from '~/utils/converters';
import DishGrid from '~/components/DishGrid';

export async function loader({context}) {
  const pureMenus = await context.storefront.query(MENUS_QUERY);
  const pureProducts = await context.storefront.query(PRODUCTS_QUERY);

  const menus = pureMenus?.metaobjects?.edges?.map((menu) => ({
    id: menu?.node?.id,
    ...fieldsToObject(menu?.node?.fields),
  }));

  const products = pureProducts?.products?.edges?.map((prod) => {
    const nutrients = fieldsToObject(prod?.node?.metafields);
    const product = {
      ...prod?.node,
      ...nutrients,
    };
    delete product.metafields;
    return product;
  });

  menus.forEach((menu) => {
    const prods = products.filter((prod) => menu.products.includes(prod.id));
    menu.products = prods;
  });

  return {menus};
}

export default function Menu() {
  const {menus} = useLoaderData();

  console.log(menus);
  // console.log(products);

  return (
    <>
      {!menus.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Hiện chưa có thực đơn nào
          </h1>
        </section>
      )}
      {!!menus.length &&
        menus.map((menu) => (
          <section
            className="w-[92vw] mx-auto mt-8 text-green-700"
            key={menu.id}
          >
            <h1 className="font-bold text-xl md:text-2xl mb-4">{menu.title}</h1>
            <MenuSlider products={menu.products} />
          </section>
        ))}
    </>
  );
}

function MenuSlider({products}) {
  return (
    <div className="slider gap-4 px-[1.5vw] no-scrollbar">
      {products.map((prod) => (
        <MenuCard
          className="slider-item w-[82vw] max-w-[300px]"
          data={prod}
          key={prod.handle}
        />
      ))}
    </div>
  );
}

function MenuCard({data, className}) {
  return (
    <div className={`card ${className}`}>
      <Link
        to={`/dishes/${data.handle}`}
        className="flex flex-nowrap justify-center items-center text-center"
      >
        <div
          style={{backgroundImage: `url('${data?.featuredImage?.url}')`}}
          className="w-1/2 bg-center bg-cover aspect-square rounded-xl"
        />
        <div className="w-1/2 text-green-700">
          <h3 className="font-bold">{data.title}</h3>
          <p>Cỡ: 100 gram</p>
          <p>
            Dinh dưỡng: {data.protein * 100} g đạm, {data.fat * 100} g chất béo,{' '}
            {data.carb * 100} g carbonhydrat, {data.kcal * 100} calories,{' '}
          </p>
        </div>
      </Link>
    </div>
  );
}

const MENUS_QUERY = `#graphql
  query {
    metaobjects(type:"menu",first:100) {
      edges {
        node {
          id
          type
          fields {
            value
            key
          }
          handle
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  query {
    products(first:250) {
      edges {
        node {
          id
          title
          handle
          totalInventory
          featuredImage{
            url
          }
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
          metafields(identifiers:[
            {
              namespace:"custom"
              key:"protein"
            },
            {
              namespace:"custom"
              key:"fat"
            },
            {
              namespace:"custom"
              key:"carb"
            },
            {
              namespace:"custom"
              key:"kcal"
            }
          ]) {
            key
            value
          }
        }
      }
    }
  }
`;
