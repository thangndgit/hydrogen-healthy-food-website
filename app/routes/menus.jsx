import {useLoaderData} from '@remix-run/react';
import {fieldsToObject} from '~/utils/converters';
import InputRange from '@gollum-ts/react-input-range';
import {useMemo, useState} from 'react';

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

  const [nutrients, setNutrients] = useState({
    protein: {min: 0, max: 100},
    carb: {min: 0, max: 100},
    fat: {min: 0, max: 100},
    kcal: {min: 0, max: 100},
  });

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Gợi ý thực đơn</h1>
        <form className="form">
          <div className="flex items-center gap-4">
            <label htmlFor="protein" className="w-32">
              Protein
            </label>
            <InputRange
              maxValue={100}
              minValue={0}
              value={nutrients.protein}
              onChange={(value) => setNutrients({...nutrients, protein: value})}
              id="protein"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="fat" className="w-32">
              Chất béo
            </label>
            <InputRange
              maxValue={100}
              minValue={0}
              value={nutrients.fat}
              onChange={(value) => setNutrients({...nutrients, fat: value})}
              id="fat"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="carb" className="w-32">
              Carbohydrate
            </label>
            <InputRange
              maxValue={100}
              minValue={0}
              value={nutrients.carb}
              onChange={(value) => setNutrients({...nutrients, carb: value})}
              id="carb"
            />
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="kcal" className="w-32">
              Calories
            </label>
            <InputRange
              maxValue={100}
              minValue={0}
              value={nutrients.kcal}
              onChange={(value) => setNutrients({...nutrients, kcal: value})}
              id="kcal"
            />
          </div>
        </form>
      </section>
      {!menus.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Hiện chưa có sẵn thực đơn nào
          </h1>
        </section>
      )}
      {!!menus.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Danh sách thực đơn
          </h1>
          <MenuGrid menus={menus} />
        </section>
      )}
    </>
  );
}

function MenuGrid({menus}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`}>
      {menus.map((menu) => (
        <MenuCard menu={menu} key={menu?.id} />
      ))}
    </div>
  );
}

function MenuCard({menu}) {
  const dishesName = menu?.products?.map((prod) => prod.title).join(', ');
  const nutrientsTotal = menu?.products?.reduce(
    (nutrients, prod) => {
      let sizeOption = prod.options.find((opt) => opt.name === 'Cỡ');
      if (!sizeOption) sizeOption = {values: [100]};

      const weights = sizeOption.values.map((val) => parseInt(val));
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);
      const ntr = {
        protein: prod.protein,
        carb: prod.carb,
        fat: prod.fat,
        kcal: prod.kcal,
      };

      for (let key in ntr) {
        const val = ntr[key] / 100;
        nutrients.min[key] += val * minWeight;
        nutrients.max[key] += val * maxWeight;
      }

      return nutrients;
    },
    {
      min: {
        protein: 0,
        carb: 0,
        kcal: 0,
        fat: 0,
      },
      max: {
        protein: 0,
        carb: 0,
        kcal: 0,
        fat: 0,
      },
    },
  );

  const ntrToStr = (ntr = {protein: 0, carb: 0, kcal: 0, fat: 0}) =>
    `${ntr.protein}g protein, ${ntr.fat}g fat, ${ntr.carb}g carb, ${ntr.kcal}kcal`;

  return (
    <div className={`grid md:grid-cols-2 gap-6 mb-6 md:mb-0`}>
      <div
        style={{backgroundImage: `url('${menu?.image_url}')`}}
        className={`card aspect-square bg-center bg-cover`}
      />
      <div className="grid gap-3">
        <h3 className="font-bold text-xl">{menu?.title}</h3>
        <p>Thực đơn gồm: {dishesName}.</p>
        <p>Dinh dưỡng tối thiểu: {ntrToStr(nutrientsTotal.min)}.</p>
        <p>Dinh dưỡng tối đa: {ntrToStr(nutrientsTotal.max)}.</p>
        <button className="btn btn-primary">Đặt ngay</button>
      </div>
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
          options {
            id
            name
            values
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
