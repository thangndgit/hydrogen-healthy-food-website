import {Form, Link, useLocation, useMatches} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {imagePathToUrl} from '~/utils/converters';
import {
  BiMenu,
  BiSearch,
  BiCart,
  BiCategory,
  BiUser,
  BiFoodMenu,
  BiDish,
  BiHome,
} from 'react-icons/bi';

import logoImg from '~/assets/images/logo-small.png';
import {Drawer, useDrawer} from './Drawer';

export default function Header() {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const menu = {
    items: [
      {
        title: 'Danh mục',
        to: '/categories',
        icon: <BiCategory />,
      },
      {
        title: 'Món ăn',
        to: '/dishes',
        icon: <BiDish />,
      },
      {
        title: 'Thực đơn',
        to: '/menus',
        icon: <BiFoodMenu />,
      },
    ],
  };

  const location = useLocation();

  return (
    <>
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={closeMenu}
        menu={menu}
        pathname={location.pathname}
      />
      <DesktopHeader menu={menu} pathname={location.pathname} />
      <MobileHeader menu={menu} openMenu={openMenu} />
    </>
  );
}

export function MenuDrawer({isOpen, onClose, menu, pathname}) {
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      openFrom="left"
      heading="Menu"
      className="bg-gray-100 text-green-700"
    >
      <div className="grid pl-4">
        <MenuMobileNav menu={menu} onClose={onClose} pathname={pathname} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose, pathname}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8 ">
      {(menu?.items || []).map((item) => (
        <span key={item.to} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={`flex items-center gap-2 pb-1 w-fit whitespace-nowrap hover:border-green-700 hover:border-b-2 hover:-mb-0.5 ${
              item.to === pathname && 'border-green-700 border-b-2 -mb-0.5'
            }`}
          >
            {item.icon} <span className="text-copy">{item.title}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({openMenu}) {
  return (
    <header
      role="banner"
      className="shadow bg-gray-200 px-4 py-2 flex lg:hidden items-center sticky z-40 top-0 justify-between w-full leading-none gap-4 md:gap-8 text-green-700"
    >
      <div className="flex items-center justify-start w-fit gap-0 sm:gap-2 md:gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <BiMenu />
        </button>

        <Link
          className="flex items-center justify-center w-8 h-8 sm:w-20 md:justify-center hover:border-green-700 hover:border-b-2 hover:-mb-0.5 sm:hover:border-none sm:hover:mb-0"
          to="/"
        >
          <Image
            alt="logo"
            src={imagePathToUrl(logoImg)}
            width={80}
            height={40}
            className="hidden sm:block"
          />
          <BiHome className="block sm:hidden" />
        </Link>
      </div>

      <Form action="/search" className="relative w-full max-w-md">
        <input
          type="search"
          name="q"
          placeholder="Bạn muốn ăn gì?"
          className="w-full shadow-border shadow-green-700 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none placeholder:text-green-700"
        />
        <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
          <BiSearch />
        </button>
      </Form>

      <div className="flex items-center justify-end w-fit gap-0 sm:gap-2 md:gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8 hover:border-green-700 hover:border-b-2 hover:-mb-0.5" />
        <CartLink className="relative flex items-center justify-center w-8 h-8 hover:border-green-700 hover:border-b-2 hover:-mb-0.5" />
      </div>
    </header>
  );
}

function DesktopHeader({menu, pathname}) {
  return (
    <header
      role="banner"
      className="hidden shadow lg:flex flex-col items-center sticky transition duration-300 z-40 top-0 justify-between w-full leading-none text-green-700"
    >
      {pathname === '/' && (
        <div className="bg-white px-12 py-4 flex items-center justify-between w-full gap-8 text-black">
          <span>Bạn cần giúp đỡ? Liên hệ 0987654321</span>
          <span className="font-semibold">Miễn phí giao đơn hàng đầu tiên</span>
        </div>
      )}
      <div className="bg-gray-200 px-12 py-4 flex items-center justify-between w-full gap-8">
        <div className="flex gap-12 items-center">
          <Link className="font-bold h-10 w-20" to="/" prefetch="intent">
            <Image
              alt="logo"
              src={imagePathToUrl(logoImg)}
              width={80}
              height={40}
            />
          </Link>
          <nav className="flex gap-8 items-center text-green-700 w-fit">
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                target={item.target}
                prefetch="intent"
                className={`flex items-center gap-2 w-fit pb-1 whitespace-nowrap hover:border-green-700 hover:border-b-2 hover:-mb-0.5 ${
                  item.to === pathname && 'border-green-700 border-b-2 -mb-0.5'
                }`}
              >
                {item.icon} {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-8">
          <Form
            action="search"
            className="relative text-green-700 w-full max-w-md md:w-72"
          >
            <input
              type="search"
              name="q"
              placeholder="Bạn muốn ăn gì?"
              className="w-full shadow-border h-10 px-5 pr-10 rounded-full text-sm focus:outline-none placeholder:text-green-700 shadow-green-700"
            />
            <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
              <BiSearch />
            </button>
          </Form>
          <CartLink className="relative flex items-center justify-center w-8 h-8 md:w-fit gap-2 hover:border-green-700 hover:border-b-2 hover:-mb-0.5" />
          <AccountLink className="relative flex items-center justify-center w-8 h-8 md:w-fit gap-2 hover:border-green-700 hover:border-b-2 hover:-mb-0.5" />
        </div>
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();

  const isLoggedIn = root.data?.isLoggedIn;

  if (isLoggedIn)
    return (
      <Link to="/account" className={className}>
        <BiUser />
        <span className="hidden whitespace-nowrap lg:block">Tài khoản</span>
      </Link>
    );

  return (
    <Link to="/login" className={className}>
      <BiUser />
      <span className="hidden whitespace-nowrap lg:block">Đăng nhập</span>
    </Link>
  );
}

function CartLink({className}) {
  return (
    <Link to="/cart" className={className}>
      <BiCart />
      <span className="hidden whitespace-nowrap lg:block">Giỏ hàng</span>
    </Link>
  );
}
