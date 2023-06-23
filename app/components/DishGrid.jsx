import {Link} from '@remix-run/react';
import DishCard from './DishCard';

export default function DishGrid({products, path, className}) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 ${className}`}
    >
      {products.map((product) => (
        <DishCard product={product?.node} key={product?.node?.id} />
      ))}
      {path && (
        <div className="card aspect-square">
          <Link
            to={path}
            className="w-full h-full flex justify-center items-center text-xl"
          >
            Xem tất cả
          </Link>
        </div>
      )}
    </div>
  );
}
