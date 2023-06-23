import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';

export function meta() {
  return [
    {title: 'Đặt lại mật khẩu'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export default function ResetPassword() {
  return (
    <div
      id="page-reset-password"
      className="w-screen h-[calc(100vh-72px)] flex flex-wrap text-green-700"
    >
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full px-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-526.5px)/2)]">
          <Image
            data={{
              altText: 'logo',
              url: imagePathToUrl(logoImg),
            }}
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đặt lại mật khẩu</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          <form className="form">
            <label htmlFor="password" className="mt-2">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              required
            />

            <label htmlFor="retype-password" className="mt-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng xác nhận lại mật khẩu"
              required
            />

            <Link to="/register" className="link text-sm self-end w-fit">
              Tạo tài khoản mới
            </Link>

            <button className="btn btn-primary font-semibold mt-3">
              Đặt lại mật khẩu
            </button>

            <Link to="/login" className="link text-sm text-center">
              Thử đăng nhập lại
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
