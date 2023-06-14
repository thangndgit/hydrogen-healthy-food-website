import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {FcGoogle} from 'react-icons/fc';
import {BsFacebook} from 'react-icons/bs';

import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';

export default function Login() {
  return (
    <div
      id="page-login"
      className="w-screen flex flex-wrap text-green-700"
      style={{height: 'calc(100vh - 56px)'}}
    >
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full p-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-2">
          <Image
            data={{altText: 'logo', url: imagePathToUrl(logoImg)}}
            alt="logo"
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đăng nhập</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          <div className="grid gap-3 grid-cols-2 mt-3">
            <button className="btn btn-outline-primary flex gap-2">
              <FcGoogle style={{height: '28px', width: '28px'}} />
              Google
            </button>
            <button className="btn btn-outline-primary flex gap-2">
              <BsFacebook
                style={{height: '28px', width: '28px'}}
                fill="#1877F2"
              />
              Facebook
            </button>
          </div>

          <form className="form">
            <label htmlFor="email" className="mt-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Vui lòng nhập địa chỉ Email"
              required
            />

            <label htmlFor="password" className="mt-2">
              Mật khẩu
            </label>

            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              required
            />

            <Link to="/forget-password" className="link text-sm w-fit self-end">
              Quên mật khẩu?
            </Link>

            <button className="btn btn-primary font-semibold mt-3">
              Đăng nhập
            </button>

            <Link to="/register" className="link text-sm text-center">
              Bạn chưa có tài khoản? Đăng ký ngay!
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
