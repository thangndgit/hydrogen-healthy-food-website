import {json, redirect} from '@shopify/remix-oxygen';
import {Form, Link, useActionData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';
import {ToastContainer, toast} from 'react-toastify';
import {useEffect} from 'react';

export const handle = {isPublic: true};

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({shopName: 'FitMealsDeli'});
}

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context}) => {
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');
  const acceptsMarketing = !!formData.get('acceptsMarketing');
  const customer = {acceptsMarketing};

  if (!email || !password) {
    return badRequest({
      formError: 'Bạn chưa nhập đủ thông tin',
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

  const {session, storefront} = context;

  try {
    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    await context.storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken,
        customer,
      },
    });

    return redirect('/', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        timeError: new Date(),
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError: 'Sai thông tin đăng nhập.',
      timeError: new Date(),
    });
  }
};

export const meta = () => {
  return [{title: 'Đăng nhập'}];
};

export default function Login() {
  const actionData = useActionData();

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
      id="page-login"
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
        {/* <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-596px)/2)]"> */}
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-526.5px)/2)]">
          <Image
            data={{altText: 'logo', url: imagePathToUrl(logoImg)}}
            alt="logo"
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đăng nhập</b>
            <div className="h-0 border border-t-green-700 grow" />
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
              placeholder="Vui lòng nhập địa chỉ Email"
              aria-label="Vui lòng nhập địa chỉ Email"
              required
            />

            <label htmlFor="password" className="mt-2">
              Mật khẩu
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Vui lòng nhập mật khẩu"
              aria-label="Vui lòng nhập mật khẩu"
              required
            />

            <div className="flex justify-between">
              <div className="flex items-center gap-1">
                <input
                  type="checkbox"
                  id="acceptsMarketing"
                  name="acceptsMarketing"
                  defaultChecked
                />
                <span className="text-sm">Nhận ưu đãi</span>
              </div>
              <Link to="/forget-password" className="link text-sm w-fit">
                Quên mật khẩu?
              </Link>
            </div>

            <button className="btn btn-primary font-semibold mt-3">
              Đăng nhập
            </button>

            <Link to="/register" className="link text-sm text-center">
              Bạn chưa có tài khoản? Đăng ký ngay!
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
}

const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export async function doLogin({storefront}, {email, password}) {
  const data = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  /**
   * Something is wrong with the user's input.
   */
  throw new Error(
    data?.customerAccessTokenCreate?.customerUserErrors.join(', '),
  );
}
