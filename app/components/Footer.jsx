import {Form, Link, useLocation} from '@remix-run/react';
import {BiHeadphone, BiPaperPlane} from 'react-icons/bi';

export default function Footer() {
  const location = useLocation();
  const blockedPaths = [
    '/login',
    '/register',
    '/forget-password',
    '/reset-password',
  ];

  if (!blockedPaths.includes(location.pathname))
    return (
      <footer className="bg-[rgb(183,212,183)] w-full px-4 p-8 lg:px-12 text-green-700 mt-20">
        <div className="rounded-xl p-8 bg-white">
          <div className="flex flex-nowrap gap-6 w-fit flex-col lg:w-full lg:gap-8 lg:flex-row lg:justify-between lg:items-center max-w-5xl m-auto">
            <div className="text-xl font-semibold">
              Nhận thông tin mới nhất!
            </div>
            <Form action="" className="relative grow max-w-sm">
              <input
                type="email"
                name="email"
                placeholder="Địa chỉ email"
                className="w-full shadow-border h-10 px-5 pr-10 rounded-full text-sm focus:outline-none placeholder:text-white shadow-green-700  text-white bg-green-700"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-3 mr-4"
              >
                <BiPaperPlane fill="white" />
              </button>
            </Form>
            <div className="flex gap-4 items-center">
              <BiHeadphone size="3rem" />
              <div>
                <div>Tổng đài hỗ trợ 24/7</div>
                <div>(+84) 0987654321</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-8 sm:m-auto sm:flex-row justify-between mt-6 lg:mt-8 max-w-5xl">
          <div className="mb-6">
            <div className="font-bold mb-2">Menu</div>
            <ul className="list-inside list-disc">
              <li>
                <Link className="link" to="/">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link className="link" to="/categories">
                  Danh mục
                </Link>
              </li>
              <li>
                <Link className="link" to="/products">
                  Món ăn
                </Link>
              </li>
              <li>
                <Link className="link" to="/menus">
                  Thực đơn
                </Link>
              </li>
              <li>
                <Link className="link" to="/search">
                  Tìm kiếm
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <div className="font-bold mb-2">Trợ giúp</div>
            <ul className="list-inside list-disc">
              <li>
                <Link className="link" to="/">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  Chính sách
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  Chăm sóc khách hàng
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div className="mb-6">
            <div className="font-bold mb-2">Liên hệ</div>
            <ul className="list-inside list-disc">
              <li>
                <Link className="link" to="/">
                  Foodie
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  Facebook
                </Link>
              </li>
              <li>
                <Link className="link" to="/">
                  Instagram
                </Link>
              </li>
              <li>(+84) 987654321</li>
              <li>66 Giải Phóng</li>
            </ul>
          </div>
        </div>
      </footer>
    );
}
