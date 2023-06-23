import {Link} from '@remix-run/react';
import {useMemo} from 'react';

export default function DishCard({product}) {
  const priceText = useMemo(() => {
    if (!product?.totalInventory) return 'Hết món';

    if (
      product?.priceRange?.maxVariantPrice?.amount ===
      product?.priceRange?.minVariantPrice?.amount
    )
      return Number(
        product?.priceRange?.minVariantPrice?.amount,
      ).toLocaleString();
    return (
      Number(product?.priceRange?.minVariantPrice?.amount).toLocaleString() +
      ' - ' +
      Number(product?.priceRange?.maxVariantPrice?.amount).toLocaleString()
    );
  }, [
    product?.priceRange?.maxVariantPrice?.amount,
    product?.priceRange?.minVariantPrice?.amount,
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
      <p className="font-semibold text-black">{priceText} Đ</p>
    </Link>
  );
}
