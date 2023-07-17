import {Form, Link, useActionData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json, redirect} from '@shopify/remix-oxygen';
import logoImg from '~/assets/images/logo-big.png';
import {imagePathToUrl} from '~/utils/converters';
import {ToastContainer, toast} from 'react-toastify';
import {useEffect} from 'react';
import {doLogin} from './login';
// import { CUSTOMER_CREATE_MUTATION } from './<path-to-your-graphql-file>';

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect('/account');
  }

  return new Response(null);
}

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context}) => {
  const {session, storefront} = context;
  const formData = await request.formData();

  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const firstName = formData.get('firstName');
  const phone = formData.get('phone');
  const lastName = formData.get("lastName")
  const acceptsMarketing = true;

  if (!email || !password || !confirmPassword || !firstName || !phone || !lastName) {
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

  if (password.length < 8) {
    return badRequest({
      formError: 'Mật khẩu phải có tối thiểu 8 ký tự',
      timeError: new Date(),
    });
  }
  if (phone.length !== 10) {
    return badRequest({
      formError: 'Số điện thoại phải có đúng 10 chữ số',
      timeError: new Date(),
    });
  }  
  if (password !== confirmPassword) {
    return badRequest({
      formError: 'Mật khẩu xác nhận không khớp',
      timeError: new Date(),
    });
  }

  try {
    const data = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password, first: firstName, phone, last: lastName,},
      },
    });

    if (!data?.customerCreate?.customer?.id) {
      /**
       * Something is wrong with the user's input.
       */
      throw new Error(data?.customerCreate?.customerUserErrors.join(', '));
    }

    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    // return redirect('/account', {
    return redirect('/', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Có lỗi xảy ra. Vui lòng thử lại sau',
        timeError: new Date(),
        message: error.message
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError: 'Tài khoản sử dụng email này đã tồn tại trên hệ thống',
      timeError: new Date(),
      message: error.message.response
    });
  }
};

export const meta = () => {
  return [
    {
      title: 'Đăng ký',
    },
  ];
};

export default function Register() {
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

  // const handleRegister = async (values) => {
  //   const response = await axios
  // }
  return (
    <div
      id="page-register"
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
        <div className="max-w-xs m-auto flex flex-col gap-3 mt-[calc((100vh-72px-616px)/2)]">
          <Image
            data={{
              altText: 'logo',
              url: imagePathToUrl(logoImg),
            }}
            width={200}
            className='mx-auto'
          />

          <div className="flex text-lg items-center gap-6">
            <div className="h-0 border border-t-green-700 grow" />
            <b>Đăng ký</b>
            <div className="h-0 border border-t-green-700 grow" />
          </div>

          <Form method="post" noValidate className="form">
          <form action="#">
          
          </form>
          <label htmlFor="name" className="mt-2">
              Họ và tên
            </label>
            <div className='grid grid-cols-2 gap-2' >
            <input 
             id='firstName'
             name='firstName'
             type="firstName" 
             autoComplete='firstName'
             placeholder='Họ ' 
             required />
              <input 
             id='lastName'
             name='lastName'
             type="lastName" 
             autoComplete='lastName'
             placeholder='Tên' 
             required />
            </div>
          <label htmlFor="number" className="mt-2">
              Số điện thoại
            </label>
          <input 
             id='phone'
             name='phone'
             type="phone"
             autoComplete='phone' 
             placeholder='Số điện thoại' 
            required />
            
            <label htmlFor="email" className="mt-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Vui lòng nhập địa chỉ Email"
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
              required
            />

            <label htmlFor="retype-password" className="mt-2">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
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
          </Form>
        </div>
      </div>
    </div>
  );
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
