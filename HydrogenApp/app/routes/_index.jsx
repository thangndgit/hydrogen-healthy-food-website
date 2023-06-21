import {Link, useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen-react';
import HeroSlider from '~/components/HeroSlider';
import ProductItem from '~/components/ProductItem';

import menuBanner from '~/assets/images/menu-banner.jpg';
import {MdLocalShipping} from 'react-icons/md';
import {RiLockFill, RiVipCrownFill} from 'react-icons/ri';

export function meta() {
  return [
    {title: 'FitMealsDeli'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export async function loader({context}) {
  return await context.storefront.query(COLLECTIONS_QUERY);
}

export default function Index() {
  const {collections} = useLoaderData();
  return (
    <>
      <section className="w-full">
        <HeroSlider />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl mb-4">Món ăn nổi bật</h1>
        <ProductList />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl mb-4">Món ăn theo chủ đề</h1>
        <CategorySlider />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-white">
        <MenuBanner />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl mb-4">Thực đơn hôm nay</h1>
        <MenuSlider />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <InfoBanner />
      </section>
      <section className="w-[92vw] mx-auto mt-8 mb-12 text-green-700">
        <h1 className="font-bold text-xl mb-4">Nhận xét của khách hàng</h1>
        <FeedbackSlider />
      </section>
      {/* <section className="w-[92vw] mx-auto mt-8">
        <h2 className="whitespace-pre-wrap max-w-prose font-bold text-lead">
          Collections
        </h2>
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-4 lg:gap-6 grid-cols-1 false  sm:grid-cols-3 false false">
          {collections.nodes.map((collection) => {
            return (
              <Link
                to={`/collections/${collection.handle}`}
                key={collection.id}
              >
                <div className="grid gap-4">
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      key={collection.id}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      widths={[400, 500, 600, 700, 800, 900]}
                      loaderOptions={{
                        scale: 2,
                        crop: 'center',
                      }}
                    />
                  )}
                  <h2 className="whitespace-pre-wrap max-w-prose font-medium text-copy">
                    {collection.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </section> */}
    </>
  );
}

function MenuBanner() {
  return (
    <div
      style={{backgroundImage: `url('${menuBanner}')`}}
      className="bg-left bg-cover w-full h-[300px] rounded-2xl"
    >
      <Link
        to="/menu"
        className="p-6 h-full drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-b from-transparent to-green-700 opacity-90 flex flex-col gap-4 justify-center items-center font-bold text-2xl text-center rounded-2xl"
      >
        <p className="w-2/3">Bạn có chế độ ăn khắt khe?</p>
        <p className="w-2/3">Tạo đơn theo chế độ ăn tại đây!</p>
      </Link>
    </div>
  );
}

function MenuSlider() {
  const menus = [
    {
      name: 'Ăn kiêng 1',
      handle: 'an-kieng-1',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 4,
      calories: 1200,
    },
    {
      name: 'Ăn kiêng 2',
      handle: 'an-kieng-2',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 3,
      calories: 700,
    },
    {
      name: 'Gymer 1',
      handle: 'gymer-1',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 3,
      calories: 2700,
    },
    {
      name: 'Gymer 2',
      handle: 'gymer-2',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 5,
      calories: 3200,
    },
    {
      name: 'Gymer 3',
      handle: 'gymer-3',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 3,
      calories: 2500,
    },
    {
      name: 'Low carbs',
      handle: 'low-carbs',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 3,
      calories: 1200,
    },
  ];

  return (
    <div className="slider gap-4 px-[1.5vw] no-scrollbar">
      {menus.map((menu) => (
        <MenuCard
          className="slider-item w-[82vw] max-w-[300px]"
          data={menu}
          key={menu.handle}
        />
      ))}
      <div className="card slider-item w-[150px]">
        <Link
          to="/menus"
          className="w-full h-full flex justify-center items-center text-xl whitespace-nowrap"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
}

function MenuCard({data, className}) {
  return (
    <div className={`card ${className}`}>
      <Link
        to={`/category/${data.handle}`}
        className="flex flex-nowrap justify-center items-center text-center"
      >
        <div
          style={{backgroundImage: `url('${data.imageUrl}')`}}
          className="w-1/2 bg-center bg-cover aspect-square rounded-xl"
        />
        <div className="w-1/2 text-green-700">
          <h3 className="font-bold">{data.name}</h3>
          <p>{`${data.count} món`}</p>
          <p>{`${data.calories.toLocaleString()} kcal`}</p>
        </div>
      </Link>
    </div>
  );
}

function CategorySlider() {
  const categories = [
    {
      name: 'Món khai vị',
      handle: 'mon-khai-vi',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 12,
    },
    {
      name: 'Món chính',
      handle: 'mon-chinh',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 10,
    },
    {
      name: 'Tráng miệng',
      handle: 'mon-trang-mieng',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 10,
    },
    {
      name: 'Đồ ăn nhanh',
      handle: 'do-an-nhanh',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 15,
    },
    {
      name: 'Đồ ăn vặt',
      handle: 'do-an-vat',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 12,
    },
    {
      name: 'Đồ uống',
      handle: 'do-uong',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
      count: 18,
    },
  ];

  return (
    <div className="slider gap-4 px-[1.5vw] no-scrollbar">
      {categories.map((cate) => (
        <CategoryCard
          className="slider-item w-[82vw] max-w-[300px]"
          data={cate}
          key={cate.handle}
        />
      ))}
      <div className="card slider-item w-[150px]">
        <Link
          to="/categories"
          className="w-full h-full flex justify-center items-center text-xl whitespace-nowrap"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
}

function CategoryCard({data, className}) {
  return (
    <div className={`card ${className}`}>
      <Link
        to={`/categories/${data.handle}`}
        className="flex flex-nowrap justify-center items-center text-center"
      >
        <div
          style={{backgroundImage: `url('${data.imageUrl}')`}}
          className="w-1/2 bg-center bg-cover aspect-square rounded-xl"
        />
        <div className="w-1/2 text-green-700">
          <h3 className="font-bold">{data.name}</h3>
          <p>{`(${data.count} món)`}</p>
        </div>
      </Link>
    </div>
  );
}

function InfoBanner() {
  return (
    <div className="px-4 py-8 rounded-xl bg-[rgb(183,212,183)] w-full">
      <div className="flex justify-center w-fit m-auto gap-6 flex-col md:flex-row md:w-full md:justify-between max-w-5xl">
        <div className="flex gap-4">
          <MdLocalShipping size="50px" />
          <div>
            <h3 className="font-bold">Miễn phí vận chuyển</h3>
            <p>Đơn hàng từ 100.000 Đ</p>
          </div>
        </div>
        <div className="flex gap-4">
          <RiVipCrownFill size="50px" />
          <div>
            <h3 className="font-bold">Chất lượng tuyệt vời</h3>
            <p>Với giá cả hợp lý</p>
          </div>
        </div>
        <div className="flex gap-4">
          <RiLockFill size="50px" />
          <div>
            <h3 className="font-bold">An toàn & bảo mật</h3>
            <p>Thông tin được mã hóa</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <ProductItem />
      <div className="card">
        <Link
          to="/products"
          className="w-full h-full flex justify-center items-center text-xl"
        >
          Xem tất cả
        </Link>
      </div>
    </div>
  );
}

function FeedbackSlider() {
  const menus = [
    {
      name: 'Nguyễn Văn An',
      text: 'Dịch vụ tốt, món ăn ngon, rất đáng đồng tiền. Nên thử!',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
    {
      name: 'Nguyễn Văn Bình',
      text: 'Quán ăn chất lượng nhất mà mình biết trong các quán ăn healthy. Thích nhất Beefsteak của quán này, lần nào mình cũng gọi suất size L',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
    {
      name: 'Nguyễn Văn Công',
      text: 'Quán làm ăn rất có tâm, đóng gói cẩn thận, đồ ăn chất lượng, đáng đồng tiền!',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
    {
      name: 'Nguyễn Văn Dương',
      text: 'Phải nói là đồ ăn quá chất lượng so với giá tiền. Nên thử!',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
    {
      name: 'Nguyễn Văn Em',
      text: 'Biết tới quán qua bạn bè giới thiệu, ăn thử cho biết mà thực sự là quá ưng luôn! Menu đồ ăn low carbs quá xuất sắc!',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
    {
      name: 'Nguyễn Văn Fát',
      text: 'Mình là người cần có một chế độ ăn phức tạp, nên khi tự chuẩn bị rất mất công. Nhờ có quán mà mình tiết kiệm được rất nhiều thời gian!',
      imageUrl:
        'https://content.jdmagicbox.com/comp/ahmedabad/x5/079pxx79.xx79.180903204439.j4x5/catalogue/pape-the-burgerwala-mithakhali-ahmedabad-burger-joints-dntnsuwfw9-250.jpg',
    },
  ];

  return (
    <div className="slider gap-4 px-[1.5vw] no-scrollbar">
      {menus.map((menu) => (
        <FeedbackCard
          className="slider-item w-[82vw] max-w-[300px]"
          data={menu}
          key={menu.name}
        />
      ))}
    </div>
  );
}

function FeedbackCard({data, className}) {
  return (
    <div className={`card flex flex-col gap-4 ${className} hover:opacity-100`}>
      <div className="flex flex-nowrap gap-4 items-center">
        <div className="w-1/3 aspect-square rounded-full border-dashed border-2 p-1 border-green-700">
          <div
            style={{backgroundImage: `url('${data.imageUrl}')`}}
            className="bg-center bg-cover aspect-square rounded-full"
          />
        </div>
        <div className="w-2/3 font-semibold">{data.name}</div>
      </div>
      <div className="rounded-xl bg-[rgb(183,212,183)] p-4 grow">
        {data.text}
      </div>
    </div>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query FeaturedCollections {
    collections(first: 3, query: "collection_type:smart") {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
