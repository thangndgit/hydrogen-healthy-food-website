import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';

import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';

export default function Register() {
  return (
    <div
      id="page-register"
      className="w-screen flex flex-wrap text-green-700"
      style={{height: 'calc(100vh - 56px)'}}
    >
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full p-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-2">
          <Image
            data={{
              altText: 'logo',
              url: imagePathToUrl(logoImg),
            }}
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đăng ký</b>
            <div className="h-0 border border-t-green-700 grow" />
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

            <label htmlFor="retype-password" className="mt-2">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng xác nhận lại mật khẩu"
              required
            />

            <Link to="/forget-password" className="link text-sm self-end w-fit">
              Lấy lại mật khẩu
            </Link>

            <button className="btn btn-primary font-semibold mt-3">
              Đăng ký
            </button>

            <Link to="/login" className="link text-sm text-center">
              Bạn đã có tài khoản? Đăng nhập ngay!
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
