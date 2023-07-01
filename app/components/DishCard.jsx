import {Link} from '@remix-run/react';
import {Money} from '@shopify/hydrogen-react';
import {useMemo} from 'react';

export default function DishCard({product}) {
  const priceComponent = useMemo(() => {
    const totalInventory = product?.totalInventory;
    const minPrice = product?.priceRange?.minVariantPrice;
    const maxPrice = product?.priceRange?.maxVariantPrice;

    if (!totalInventory)
      return <p className="font-semibold text-black">Hết món</p>;

    if (minPrice?.amount === maxPrice?.amount)
      return (
        <p className="font-semibold text-black">
          <Money withoutTrailingZeros data={minPrice} as="span" />
        </p>
      );

    return (
      <p className="font-semibold text-black">
        <Money withoutTrailingZeros data={minPrice} as="span" />
        <span> - </span>
        <Money withoutTrailingZeros data={maxPrice} as="span" />
      </p>
    );
  }, [
    product?.priceRange?.maxVariantPrice,
    product?.priceRange?.minVariantPrice,
    product?.totalInventory,
  ]);

  return (
    <Link
      to={`/dishes/${product.handle}`}
      className={`flex flex-col gap-2 mb-3 md:mb-0 ${
        !product?.totalInventory && 'opacity-50 pointer-events-none'
      }`}
    >
      <div
        style={{backgroundImage: `url('${product?.featuredImage?.url}')`}}
        className={`card aspect-square bg-center bg-cover`}
      />
      <h3 className="font-bold">{product?.title}</h3>
      {priceComponent}
    </Link>
  );
}
