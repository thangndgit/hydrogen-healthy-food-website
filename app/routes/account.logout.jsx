import {redirect} from '@shopify/remix-oxygen';

export async function doLogout(context) {
  const {session} = context;
  session.unset('customerAccessToken');

  return redirect('/login', {
    headers: {
      'Set-Cookie': await session.commit(),
    },
  });
}

export async function loader({context}) {
  return redirect(context.storefront.i18n.pathPrefix);
}

export const action = async ({context}) => {
  return doLogout(context);
};
