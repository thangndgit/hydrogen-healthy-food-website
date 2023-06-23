import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';

export function meta() {
  return [
    {title: 'Quên mật khẩu'},
    {description: 'A custom storefront powered by Hydrogen'},
  ];
}

export default function ForgetPassword() {
  return (
    <div
      id="page-forget-password"
      className="w-screen h-[calc(100vh-72px)] flex flex-wrap text-green-700"
    >
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full px-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-521px)/2)]">
          <Image
            data={{altText: 'logo', url: imagePathToUrl(logoImg)}}
            alt="logo"
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Quên mật khẩu</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          <div className="text-justify">
            Email khôi phục là email bạn đã dùng để đăng ký tài khoản. Sau khi
            gửi yêu cầu vui lòng kiểm tra hòm thư của bạn.
          </div>

          <form className="form">
            <label htmlFor="email" className="mt-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Vui lòng nhập Email khôi phục"
              required
            />

            <Link to="/register" className="link text-sm w-fit self-end">
              Tạo tài khoản mới
            </Link>

            <button className="btn btn-primary font-semibold mt-3">
              Gửi yêu cầu
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
