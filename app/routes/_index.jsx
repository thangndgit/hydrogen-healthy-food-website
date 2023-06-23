import {Link, useLoaderData} from '@remix-run/react';
import {useCallback, useEffect, useState} from 'react';

import {RiLockFill, RiVipCrownFill} from 'react-icons/ri';
import {MdLocalShipping} from 'react-icons/md';
import {RxDotFilled} from 'react-icons/rx';
import {BsChevronCompactLeft, BsChevronCompactRight} from 'react-icons/bs';

import DishGrid from '~/components/DishGrid';
import menuBanner from '~/assets/images/menu-banner.jpg';
import {fieldsToObject} from '~/utils/converters';

export function meta() {
  return [
    {title: 'FitMealsDeli'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export async function loader({context}) {
  const banners = await context.storefront.query(BANNERS_QUERY);
  const products = await context.storefront.query(PRODUCTS_QUERY);
  const collections = await context.storefront.query(COLLECTIONS_QUERY);

  return {
    banners: banners?.metaobjects?.edges?.map((banner) => ({
      id: banner?.node?.id,
      ...fieldsToObject(banner?.node?.fields),
    })),
    products: products?.products?.edges,
    collections: collections?.collections?.nodes,
  };
}

export default function Index() {
  const {banners, products, collections} = useLoaderData();

  return (
    <>
      <section className="w-full">
        <HeroSlider banners={banners} />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Món ăn nổi bật</h1>
        <DishGrid products={products} path="/dishes" />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">
          Món ăn theo chủ đề
        </h1>
        <CategorySlider collections={collections} />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-white">
        <MenuBanner />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Thực đơn hôm nay</h1>
        <MenuSlider />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <InfoBanner />
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">
          Nhận xét của khách hàng
        </h1>
        <FeedbackSlider />
      </section>
    </>
  );
}

function HeroSlider({banners}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners?.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === banners?.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [banners?.length, currentIndex]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="h-[calc(100vh-56px)] lg:h-[calc(100vh-120px)] w-full m-auto relative group">
      <div
        style={{
          backgroundImage: `url('${banners[currentIndex]?.image_url}')`,
        }}
        className="w-full h-full bg-center bg-cover duration-500 bg-green-700 text-center"
      >
        <Link
          to={banners[currentIndex]?.destination_path}
          className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.25)] h-full flex flex-col justify-end gap-6 py-[15vh] px-[15vw] text-white"
        >
          <h2 className="font-bold text-3xl">{banners[currentIndex]?.title}</h2>
          <p className="text-lg text-justify">
            {banners[currentIndex]?.description}
          </p>
        </Link>
      </div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 cursor-pointer">
        <BsChevronCompactLeft fill="white" onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 cursor-pointer">
        <BsChevronCompactRight fill="white" onClick={nextSlide} size={30} />
      </div>
      <div className="flex top-4 justify-center py-2 -translate-y-12">
        {banners?.map((banner, bannerIndex) => (
          <button
            key={banner.id}
            onClick={() => goToSlide(bannerIndex)}
            onKeyDown={() => {}}
            className={`cursor-pointer ${
              bannerIndex === currentIndex
                ? 'text-3xl text-gray-100'
                : 'text-2xl text-gray-300'
            }`}
          >
            <RxDotFilled />
          </button>
        ))}
      </div>
    </div>
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
        className="p-6 h-full drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.25)] opacity-90 flex flex-col gap-4 justify-center items-center font-bold text-xl md:text-2xl text-center rounded-2xl"
      >
        <p>Bạn có chế độ ăn khắt khe?</p>
        <p>Tạo đơn theo chế độ ăn tại đây!</p>
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
      <div className="card slider-item w-[175px]">
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

function CategorySlider({collections}) {
  return (
    <div className="slider gap-4 px-[1.5vw] no-scrollbar">
      {collections?.map((collection) => (
        <CategoryCard
          className="slider-item w-[82vw] max-w-[320px]"
          collection={collection}
          key={collection.handle}
        />
      ))}
    </div>
  );
}

function CategoryCard({collection, className}) {
  return (
    <div className={`card ${className}`}>
      <Link
        to={`/categories/${collection?.handle}`}
        className="flex flex-nowrap justify-between items-center text-center"
      >
        <div
          style={{backgroundImage: `url('${collection?.image?.url}')`}}
          className="w-1/2 bg-center bg-cover aspect-square rounded-xl"
        />
        <div className="w-1/2 text-green-700">
          <h3 className="font-bold">{collection?.title}</h3>
          <p>{`(${collection?.products?.edges?.length} món)`}</p>
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
  query {
    collections(first:100){
      nodes{
        id
        title
        handle
        image {
          url
        }
        products(first:250) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

const BANNERS_QUERY = `#graphql
  query {
    metaobjects(first:10, type:"banner") {
      edges {
        node {
          id
          type
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  query {
    products(first:9) {
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
            }
            maxVariantPrice{
              amount
            }
          }
        }
      }
    }
  }
`;
