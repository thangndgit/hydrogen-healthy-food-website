// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable hydrogen/prefer-image-component */
import logoImg from '~/assets/images/logo-big.png';
import {SocialIcon} from 'react-social-icons';
import {Link} from '@remix-run/react';

export default function Register() {
  return (
    <div
      id="page-register"
      className="w-screen h-screen flex flex-wrap text-green-700"
    >
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full p-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-14">
          <img src={logoImg} alt="logo" />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đăng ký</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          {/* <div className="grid gap-3 grid-cols-2 mt-3">
            <button className="border border-green-700 p-2 rounded flex gap-2 hover:bg-green-200">
              <SocialIcon
                style={{height: '28px', width: '28px'}}
                network="google"
              />{' '}
              Google
            </button>
            <button className="border border-green-700 p-2 rounded-md flex gap-2 hover:bg-green-200">
              <SocialIcon
                style={{height: '28px', width: '28px'}}
                network="facebook"
              />{' '}
              Facebook
            </button>
          </div> */}

          <form className="flex flex-col gap-2">
            <label htmlFor="email" className="mt-2 font-semibold">
              Email
            </label>
            <input
              type="text"
              placeholder="Vui lòng nhập địa chỉ Email"
              className="border border-green-700 rounded-md p-2 placeholder:text-green-700 placeholder:text-sm"
            />

            <label htmlFor="password" className="mt-2 font-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              className="border border-green-700 rounded-md p-2 placeholder:text-green-700 placeholder:text-sm"
            />

            <label htmlFor="retype-password" className="mt-2 font-semibold">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              placeholder="Vui lòng xác nhận lại mật khẩu"
              className="border border-green-700 rounded-md p-2 placeholder:text-green-700 placeholder:text-sm"
            />

            <Link
              to="/forget-password"
              className="self-end text-sm w-fit hover:text-green-600"
            >
              Lấy lại mật khẩu
            </Link>

            <button className="bg-green-700 text-white font-semibold p-2 rounded-md hover:bg-green-800 mt-3">
              Đăng ký
            </button>

            <Link
              to="/login"
              className="text-center text-sm hover:text-green-600"
            >
              Bạn đã có tài khoản? Đăng nhập ngay!
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
