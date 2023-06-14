import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {imagePathToUrl} from '~/utils/converters';
import {BiCart, BiCategory, BiUser} from 'react-icons/bi';

import logoImg from '~/assets/images/logo-small.png';

export default function Header() {
  return (
    <header
      role="banner"
      className={`flex items-center sticky h-14 bg-gray-200 p-2 z-40 top-0 justify-between w-full leading-none gap-4 antialiased shadow-md`}
    >
      <div className="flex gap-12 w-full">
        <div className="grow" />

        <div className="flex gap-9">
          <Link className="font-bold" to="/">
            <Image
              data={{
                altText: 'logo',
                url: imagePathToUrl(logoImg),
              }}
              className="h-10"
            />
          </Link>
          <form className="form flex-row">
            <input type="text" placeholder="Nhập tên món ăn muốn tìm . . ." />
            <button
              className="btn btn-primary whitespace-nowrapdd"
              type="submit"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="grow" />
        <div className="grow" />
        <div className="grow" />

        <ul className="flex gap-9 items-center text-green-700">
          <li className="flex gap-1 flex-nowrap whitespace-nowrap">
            <BiCategory /> Danh mục
          </li>
          <li className="flex gap-1 flex-nowrap">
            <BiCart />
            <Link to="/cart" className="link whitespace-nowrap">
              Giỏ hàng
            </Link>
          </li>
          <li className="flex gap-1 flex-nowrap">
            <BiUser />
            <Link to="/login" className="link whitespace-nowrap">
              Đăng nhập
            </Link>
          </li>
        </ul>

        <div className="grow" />
      </div>
    </header>
  );
}
