/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable hydrogen/prefer-image-component */
import {useLocation} from '@remix-run/react';
import logoImg from '~/assets/images/logo-small.png';

export default function Header({title}) {
  const location = useLocation();

  // if (location.pathname === '/login') {
  //   return null;
  // }

  return (
    <header
      role="banner"
      className={`flex items-center bg-gray-200 h-16 p-6 fixed backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 antialiased transition shadow-md`}
    >
      <div className="flex gap-12">
        <a className="font-bold" href="/">
          {/* {title} */}
          <img src={logoImg} alt="logo" className="h-12" />
        </a>
      </div>
    </header>
  );
}
