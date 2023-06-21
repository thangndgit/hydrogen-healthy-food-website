import {Link} from '@remix-run/react';

export default function ProductItem({
  product = {
    imageUrl:
      'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    name: 'Beefsteak',
    handle: 'beefsteak',
    price: 120000,
    rate: 4.3,
  },
}) {
  return (
    <Link to={`/products/${product.handle}`}>
      <div className="card text-center flex flex-col items-center gap-2 aspect-square">
        <div
          style={{backgroundImage: `url('${product?.imageUrl}')`}}
          className="aspect-square rounded-full bg-center bg-cover h-3/4 w-auto"
        />
        <h3 className="font-semibold">{product.name}</h3>
        <p className="font-semibold text-black">
          {product.price.toLocaleString()} VNĐ
        </p>
      </div>
    </Link>
  );
}
