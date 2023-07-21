/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {useFetcher, useLoaderData, useLocation} from '@remix-run/react';
import {fieldsToObject} from '~/utils/converters';
import InputRange from '@gollum-ts/react-input-range';
import {useEffect, useRef, useState} from 'react';
import {CartAction} from '~/constants/types';
import PureModal from 'react-pure-modal';

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
      nutrientsPer100Gram: nutrients,
    };
    delete product.metafields;
    return product;
  });

  menus.forEach((menu) => {
    let prods = products.filter((prod) => menu.products.includes(prod.id));

    prods.forEach((prod) => {
      let sizeOption = prod.options.find((opt) => opt.name === 'Cỡ');
      prod.options = prod.options.filter((opt) => opt.name !== 'Title');
      if (!sizeOption) {
        sizeOption = {name: 'Cỡ', values: ['100 gram']};
        prod.options.push(sizeOption);
      }

      const weights = sizeOption.values.map((val) =>
        parseInt(parseInt(String(val).replace(/\D/g, ''), 10)),
      );

      const nutrients = prod.nutrientsPer100Gram;

      prod.nutrientsPerWeight = {};

      weights.forEach((weight) => {
        prod.nutrientsPerWeight[weight] = {
          protein: Math.round(nutrients.protein * weight) / 100,
          carb: Math.round(nutrients.carb * weight) / 100,
          fat: Math.round(nutrients.fat * weight) / 100,
          kcal: Math.round(nutrients.kcal * weight) / 100,
        };
      });
    });

    menu.products = prods;
  });

  return {menus};
}

export const meta = () => {
  return [{title: 'Thực đơn'}];
};

export default function Menu() {
  const {menus} = useLoaderData();
  const location = useLocation();
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [suggestMenus, setSuggestMenus] = useState(null);
  const [isOpenOptionModal, setIsOpenOptionModal] = useState(false);
  const [optionMenu, setOptionMenu] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    let menuId = searchParams.get('menuId');
    if (menuId) {
      menuId = menuId.replaceAll('"', '');
      menuId = menuId.replaceAll('%20', ' ');
      setActiveMenuId(menuId);
    }
  }, [location.search]);

  const handleSearch = (sgMenus) => {
    sgMenus.forEach((sgMenu) => {
      const products = menus.find((menu) => menu.id === sgMenu.id)?.products;
      sgMenu.products = products;
    });
    setSuggestMenus(sgMenus);

    const topPosition = searchRef.current.getBoundingClientRect().top;
    const offset = window.pageYOffset;
    window.scrollTo({top: topPosition + offset - 70, behavior: 'smooth'});
  };

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Gợi ý thực đơn</h1>
        <MenuSearch menus={menus} onSearch={handleSearch} />
      </section>
      <div ref={searchRef}>
        {suggestMenus?.length && (
          <section className="w-[92vw] mx-auto mt-8 text-green-700">
            <SuggestOptionModal
              isOpen={isOpenOptionModal}
              onClose={() => setIsOpenOptionModal(false)}
              menu={optionMenu}
            />
            <h1 className="font-bold text-xl md:text-2xl mb-4">
              Kết quả tìm kiếm ({suggestMenus.length})
            </h1>
            <MenuSuggestGrid
              menus={suggestMenus}
              onOpenModal={(menu) => {
                setOptionMenu(menu);
                setIsOpenOptionModal(true);
              }}
            />
          </section>
        )}
      </div>
      {!menus.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Hiện chưa có sẵn thực đơn nào
          </h1>
        </section>
      )}
      {!!menus.length && (
        <section className="w-[92vw] mx-auto mt-8 text-green-700">
          <h1 className="font-bold text-xl md:text-2xl mb-6">
            Danh sách thực đơn
          </h1>
          <MenuGrid menus={menus} activeMenuId={activeMenuId} />
        </section>
      )}
    </>
  );
}

function MenuSearch({menus, onSearch}) {
  const [nutrients, setNutrients] = useState({
    protein: {min: 0, max: 50},
    carb: {min: 0, max: 80},
    fat: {min: 0, max: 30},
    kcal: {min: 0, max: 1500},
  });

  const calculateNutrients = (
    menu,
    currentIndex,
    currentNutrition,
    resultNutrition,
  ) => {
    if (currentIndex === menu.products.length) {
      resultNutrition.push({
        ...menu,
        products: currentNutrition.products,
        variants: currentNutrition.variants,
        totalNutrients: {...currentNutrition.totalNutrition},
      });
      return;
    }

    const product = menu.products[currentIndex];

    for (const weight in product.nutrientsPerWeight) {
      const newProducts = [...currentNutrition.products];
      newProducts.push(weight);

      const newVariants = [...currentNutrition.variants];
      const variant = product.variants.nodes.find((v) =>
        v.title.includes(weight),
      ).id;
      newVariants.push(variant);

      const newTotalNutrition = {...currentNutrition.totalNutrition};
      newTotalNutrition.protein += product.nutrientsPerWeight[weight].protein;
      newTotalNutrition.fat += product.nutrientsPerWeight[weight].fat;
      newTotalNutrition.carb += product.nutrientsPerWeight[weight].carb;
      newTotalNutrition.kcal += product.nutrientsPerWeight[weight].kcal;

      calculateNutrients(
        menu,
        currentIndex + 1,
        {
          products: newProducts,
          variants: newVariants,
          totalNutrition: newTotalNutrition,
        },
        resultNutrition,
      );
    }
  };

  const mergeMenus = (menus) =>
    menus.reduce((acc, menu) => {
      const {
        id,
        title,
        image_url,
        description,
        products,
        variants,
        totalNutrients,
      } = menu;

      const menuId = acc.findIndex((a) => a.id === id);

      if (menuId === -1) {
        acc.push({
          id,
          title,
          image_url,
          description,
          options: [products],
          variants: [variants],
          nutrients: [totalNutrients],
        });
      } else {
        acc[menuId].options.push(products);
        acc[menuId].variants.push(variants);
        acc[menuId].nutrients.push(totalNutrients);
      }
      return acc;
    }, []);

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    let selectedMenus = [];

    for (const menu of menus) {
      calculateNutrients(
        menu,
        0,
        {
          products: [],
          variants: [],
          totalNutrition: {protein: 0, fat: 0, carb: 0, kcal: 0},
        },
        selectedMenus,
      );
    }

    selectedMenus = selectedMenus.filter((menu) => {
      const protein = menu.totalNutrients.protein;
      const fat = menu.totalNutrients.fat;
      const carb = menu.totalNutrients.carb;
      const kcal = menu.totalNutrients.kcal;
      if (
        protein >= nutrients.protein.min &&
        protein <= nutrients.protein.max &&
        fat >= nutrients.fat.min &&
        fat <= nutrients.fat.max &&
        kcal >= nutrients.kcal.min &&
        kcal <= nutrients.kcal.max &&
        carb >= nutrients.carb.min &&
        carb <= nutrients.carb.max
      )
        return true;
      return false;
    });

    onSearch(mergeMenus(selectedMenus));
  };

  return (
    <form
      className="form px-6 py-10 pb-6 rounded-md border border-green-700"
      onSubmit={handleSubmitSearch}
    >
      <div className=" grid md:grid-cols-2 gap-12">
        <div className="flex items-center gap-4">
          <label htmlFor="protein" className="w-32">
            Protein (g)
          </label>
          <InputRange
            maxValue={50}
            minValue={0}
            value={nutrients.protein}
            onChange={(value) => setNutrients({...nutrients, protein: value})}
            id="protein"
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="fat" className="w-32">
            Chất béo (g)
          </label>
          <InputRange
            maxValue={30}
            minValue={0}
            value={nutrients.fat}
            onChange={(value) => setNutrients({...nutrients, fat: value})}
            id="fat"
          />
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="carb" className="w-32">
            Tinh bột (g)
          </label>
          <InputRange
            maxValue={80}
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
            maxValue={1500}
            minValue={0}
            value={nutrients.kcal}
            onChange={(value) => setNutrients({...nutrients, kcal: value})}
            id="kcal"
          />
        </div>
      </div>
      <button
        className="btn btn-primary w-full md:w-fit self-end px-6 mt-6"
        type="submit"
      >
        Áp dụng
      </button>
    </form>
  );
}

function MenuSuggestGrid({menus, onOpenModal}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`}>
      {menus.map((menu) => (
        <MenuSuggestCard
          menu={menu}
          key={menu?.id}
          onOpenModal={() => onOpenModal(menu)}
        />
      ))}
    </div>
  );
}

function MenuSuggestCard({menu, onOpenModal}) {
  const dishesName = menu?.products?.map((prod) => prod.title).join(', ');

  const ntrToStr = (ntr = {protein: 0, carb: 0, kcal: 0, fat: 0}) =>
    `${Math.round(100 * ntr.protein) / 100}g đạm, ${
      Math.round(100 * ntr.fat) / 100
    }g chất béo, ${Math.round(100 * ntr.carb) / 100}g tinh bột, ${
      Math.round(100 * ntr.kcal) / 100
    } calories`;

  return (
    <div className={`grid md:grid-cols-2 gap-6 mb-6`}>
      <div
        style={{backgroundImage: `url('${menu?.image_url}')`}}
        className={`card aspect-square bg-center bg-cover`}
      />
      <div className="grid gap-3">
        <h3 className="font-bold text-xl">{menu?.title}</h3>
        <p>
          <b>Thực đơn gồm:</b> {dishesName}.
        </p>
        <p>
          <b>Dinh dưỡng tối thiểu:</b> {ntrToStr(menu.nutrients[0])}.
        </p>
        <p>
          <b>Dinh dưỡng tối đa:</b>{' '}
          {ntrToStr(menu.nutrients[menu.nutrients.length - 1])}.
        </p>
        <button className="btn btn-primary" onClick={onOpenModal}>
          Đặt ngay
        </button>
      </div>
    </div>
  );
}

function SuggestOptionModal({isOpen, onClose, width = '384px', menu}) {
  const fetcher = useFetcher();

  const [selectedId, setSelectedId] = useState(null);

  const ntrToStr = (ntr = {protein: 0, carb: 0, kcal: 0, fat: 0}) =>
    `${Math.round(100 * ntr.protein) / 100}g đạm, ${
      Math.round(100 * ntr.fat) / 100
    }g chất béo, ${Math.round(100 * ntr.carb) / 100}g tinh bột, ${
      Math.round(100 * ntr.kcal) / 100
    } calories`;

  const dishesName = (option) =>
    menu?.products
      ?.map((prod, index) => {
        return prod.title + ' ' + option[index] + ' gram';
      })
      .join(', ');

  useEffect(() => {
    fetcher?.data?.formSuccess;
    if (fetcher?.data?.formSuccess) {
      const parts = fetcher?.data?.cartId?.split('/');
      const realId = parts[parts.length - 1];

      window.location.assign(
        'https://fitmealsdeli.myshopify.com/cart/c/' + realId,
      );
    }
  }, [fetcher?.data?.cartId, fetcher?.data?.formSuccess]);

  if (!menu) return <></>;

  return (
    <PureModal
      isOpen={isOpen}
      width={width}
      scrollable={true}
      onClose={() => {
        onClose();
        return true;
      }}
    >
      <h3 className="mt-3 text-lead font-medium max-w-prose mb-4">
        {menu.title}
      </h3>
      <div
        style={{backgroundImage: `url('${menu?.image_url}')`}}
        className={`card aspect-square bg-center bg-cover mb-4`}
      />
      <div className="mb-4">{menu.description}</div>
      {menu.options.map((option, index) => (
        <div
          className={`border border-green-700 rounded-xl p-4 mb-4 cursor-pointer ${
            selectedId === index ? 'bg-green-200' : ''
          }`}
          onClick={() => setSelectedId(index)}
          key={Math.random()}
        >
          <div className="mb-2">
            <b>Món ăn:</b> {dishesName(option)}
          </div>
          <div>
            <b>Dinh dưỡng:</b> {ntrToStr(menu.nutrients[index])}
          </div>
        </div>
      ))}
      <fetcher.Form action="/cart" method="post" className="whitespace-nowrap">
        <input type="hidden" name="cartAction" value={CartAction.ADD_TO_CART} />
        <input type="hidden" name="getId" value={true} />
        <input
          type="hidden"
          name="lines"
          value={JSON.stringify(
            menu?.variants[selectedId]?.map((v) => ({
              merchandiseId: v,
              quantity: 1,
            })),
          )}
        />
        <button
          type="submit"
          className={`btn btn-primary w-full`}
          disabled={!selectedId}
        >
          Đặt ngay
        </button>
      </fetcher.Form>
    </PureModal>
  );
}

function MenuGrid({menus, activeMenuId}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`}>
      {menus.map((menu) => {
        if (activeMenuId === menu.title)
          return <MenuCard menu={menu} key={menu?.id} active={true} />;
        return <MenuCard menu={menu} key={menu?.id} />;
      })}
    </div>
  );
}

function MenuCard({menu, active}) {
  const componentRef = useRef(null);

  useEffect(() => {
    if (active && componentRef.current) {
      const topPosition = componentRef.current.getBoundingClientRect().top;
      const offset = window.pageYOffset;
      window.scrollTo({top: topPosition + offset - 100, behavior: 'smooth'});
    }
  }, [active]);

  const dishesName = menu?.products?.map((prod) => prod.title).join(', ');

  const nutrientsTotal = menu?.products?.reduce(
    (nutrients, prod) => {
      let sizeOption = prod.options.find((opt) => opt.name === 'Cỡ');

      const weights = sizeOption.values.map((val) =>
        parseInt(parseInt(String(val).replace(/\D/g, ''), 10)),
      );
      const minWeight = Math.min(...weights);
      const maxWeight = Math.max(...weights);

      nutrients.min = prod.nutrientsPerWeight[minWeight];
      nutrients.max = prod.nutrientsPerWeight[maxWeight];

      return nutrients;
    },
    {
      min: {protein: 0, carb: 0, kcal: 0, fat: 0},
      max: {protein: 0, carb: 0, kcal: 0, fat: 0},
    },
  );

  const ntrToStr = (ntr = {protein: 0, carb: 0, kcal: 0, fat: 0}) =>
    `${Math.round(100 * ntr.protein) / 100}g đạm, ${
      Math.round(100 * ntr.fat) / 100
    }g chất béo, ${Math.round(100 * ntr.carb) / 100}g tinh bột, ${
      Math.round(100 * ntr.kcal) / 100
    } calories`;

  return (
    <div className={`grid md:grid-cols-2 gap-6 mb-6`} ref={componentRef}>
      <div
        style={{backgroundImage: `url('${menu?.image_url}')`}}
        className={`card aspect-square bg-center bg-cover`}
      />
      <div className="grid gap-3">
        <h3 className="font-bold text-xl">{menu?.title}</h3>
        <p>
          <b>Thực đơn gồm:</b> {dishesName}.
        </p>
        <p>
          <b>Dinh dưỡng tối thiểu:</b> {ntrToStr(nutrientsTotal.min)}.
        </p>
        <p>
          <b>Dinh dưỡng tối đa:</b> {ntrToStr(nutrientsTotal.max)}.
        </p>
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
          variants(first: 10) {
            nodes {
              id
              title
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
