import {Form, Link, useActionData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json, redirect} from '@shopify/remix-oxygen';
import {useEffect} from 'react';
import {ToastContainer, toast} from 'react-toastify';

import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect('/account');
  }

  return new Response(null);
}

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context}) => {
  const formData = await request.formData();
  const email = formData.get('email');

  if (!email) {
    return badRequest({
      formError: 'Vui lòng cung cấp email đăng ký',
      timeError: new Date(),
    });
  }

  if (
    !email.match(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    )
  ) {
    return badRequest({
      formError: 'Sai định dạng email',
      timeError: new Date(),
    });
  }

  try {
    await context.storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error) {
    return badRequest({
      formError: 'Có lỗi xảy ra. Xin vui lòng thử lại sau.',
      timeError: new Date(),
    });
  }
};

export function meta() {
  return [{title: 'Quên mật khẩu'}];
}

export default function ForgetPassword() {
  const actionData = useActionData();
  const isSubmitted = actionData?.resetRequested;

  useEffect(() => {
    if (actionData?.formError)
      toast.error(actionData?.formError, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
  }, [actionData?.formError, actionData?.timeError]);

  return (
    <div
      id="page-forget-password"
      className="w-screen h-[calc(100vh-72px)] flex flex-wrap text-green-700"
    >
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="bg-[url('~/assets/images/login-banner.png')] bg-center w-0 md:w-1/3 lg:w-1/2"></div>
      <div className="w-full px-3 md:w-2/3 lg:w-1/2">
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-521px)/2)]">
          <Image
            data={{altText: 'logo', url: imagePathToUrl(logoImg)}}
            alt="logo"
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>{!isSubmitted ? 'Quên mật khẩu' : 'Đã gửi yêu cầu'}</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          {!!isSubmitted && (
            <div>
              Nếu email bạn vừa nhập có trên hệ thống của chúng tôi, bạn sẽ nhận
              được một email hướng dẫn cách đặt lại mật khẩu tài khoản trong của
              mình. Xin vui lòng chờ từ 5 - 10 phút trước khi thực hiện lại yêu
              cầu này.
            </div>
          )}

          {!isSubmitted && (
            <>
              <div className="text-justify">
                Email khôi phục là email bạn đã dùng để đăng ký tài khoản. Sau
                khi gửi yêu cầu vui lòng kiểm tra hòm thư của bạn.
              </div>

              <Form method="post" noValidate className="form">
                <label htmlFor="email" className="mt-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Vui lòng nhập Email khôi phục"
                  aria-label="Vui lòng nhập Email khôi phục"
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
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
