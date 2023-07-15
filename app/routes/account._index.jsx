import {Form, useLoaderData} from '@remix-run/react';
import {flattenConnection} from '@shopify/hydrogen-react';
import {json, redirect} from '@shopify/remix-oxygen';
import {useState} from 'react';
import invariant from 'tiny-invariant';
import EditProfileModal from '~/components/EditProfileModal';
import EditAddressModal from '~/components/EditAddressModal';
import AccountProfile from '~/components/AccountProfile';
import AccountAddress from '~/components/AccountAddress';
import OrdersList from '~/components/OrdersList';

const formDataHas = (formData, key) => {
  if (!formData.has(key)) return false;

  const value = formData.get(key);
  return typeof value === 'string' && value.length > 0;
};

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context}) => {
  const formData = await request.formData();

  const customerAccessToken = await context.session.get('customerAccessToken');

  invariant(
    customerAccessToken,
    'Bạn phải đăng nhập mới có thể chỉnh sửa thông tin tài khoản',
  );

  const data = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!data || !data.customer) return redirect('/account/logout');

  const actionType = formData.get('actionType');

  switch (actionType) {
    case 'update profiles':
      // Validate pass
      if (
        formDataHas(formData, 'newPassword') &&
        !formDataHas(formData, 'currentPassword')
      ) {
        return badRequest({
          formError: 'Vui lòng nhập mật khẩu cũ',
          timeError: new Date(),
        });
      }

      // Validate pass
      if (
        formData.has('newPassword') &&
        formData.get('newPassword') !== formData.get('newPassword2')
      ) {
        return badRequest({
          formError: 'Mật khẩu xác nhận chưa khớp',
          timeError: new Date(),
        });
      }

      // Validate phone
      if (formData.has('phone') && !/^\+84\d{9}$/.test(formData.get('phone'))) {
        return badRequest({
          formError: 'Điện thoại phải có dạng +84xxxxxxxxx',
          timeError: new Date(),
        });
      }

      try {
        const customer = {};
        formDataHas(formData, 'firstName') &&
          (customer.firstName = formData.get('firstName'));
        formDataHas(formData, 'lastName') &&
          (customer.lastName = formData.get('lastName'));
        formDataHas(formData, 'email') &&
          (customer.email = formData.get('email'));
        formDataHas(formData, 'phone') &&
          (customer.phone = formData.get('phone'));
        formDataHas(formData, 'newPassword') &&
          (customer.password = formData.get('newPassword'));

        const data = await context.storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
          variables: {
            customerAccessToken,
            customer,
          },
        });

        const newCustomer = await context.storefront.query(CUSTOMER_QUERY, {
          variables: {
            customerAccessToken,
          },
        });

        const errorMessage =
          data?.customerUpdate?.customerUserErrors?.[0]?.message;
        if (errorMessage) {
          throw new Error(errorMessage);
        }

        return json({
          formSuccess: 'Cập nhật thông tin thành công',
          customer: newCustomer?.customer,
        });
      } catch (error) {
        return badRequest({formError: error.message, timeError: new Date()});
      }
    case 'update address':
      // Validate phone
      if (formData.has('phone') && !/^\+84\d{9}$/.test(formData.get('phone'))) {
        return badRequest({
          formError: 'Điện thoại phải có dạng +84xxxxxxxxx',
          timeError: new Date(),
        });
      }

      // Validate zip code
      if (formData.has('zip') && !/^\d{5}$/.test(formData.get('zip'))) {
        return badRequest({
          formError: 'Mã bưu chính phải là số, có dạng xxxxx',
          timeError: new Date(),
        });
      }

      try {
        const address = {};
        const fields = [
          'firstName',
          'lastName',
          'phone',
          'company',
          'address1',
          'address2',
          'city',
          'province',
          'zip',
        ];
        fields.forEach(
          (field) =>
            formDataHas(formData, field) &&
            (address[field] = formData.get(field)),
        );

        let data;

        const addressExist = formData.get('addressExist');
        const addressId = formData.get('addressId');

        if (addressExist && addressId) {
          data = await context.storefront.mutate(UPDATE_ADDRESS_MUTATION, {
            variables: {
              customerAccessToken,
              address,
              id: addressId,
            },
          });
        } else {
          data = await context.storefront.mutate(CREATE_ADDRESS_MUTATION, {
            variables: {
              customerAccessToken,
              address,
            },
          });
        }

        const newCustomer = await context.storefront.query(CUSTOMER_QUERY, {
          variables: {
            customerAccessToken,
          },
        });

        const errorMessage =
          data?.customerUpdate?.customerUserErrors?.[0]?.message;
        if (errorMessage) {
          throw new Error(errorMessage);
        }

        return json({
          formSuccess: 'Cập nhật địa chỉ thành công',
          customer: newCustomer?.customer,
        });
      } catch (error) {
        return badRequest({formError: error.message, timeError: new Date()});
      }
  }
};

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/login');
  }

  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
    },
  });

  if (!customer) {
    const session = context.session;
    session.unset('customerAccessToken');

    return redirect('/login', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  }

  return {customer, orders: flattenConnection(customer?.orders)};
}

export const meta = () => {
  return [{title: 'Tài khoản'}];
};

export default function Account() {
  const data = useLoaderData();
  const orders = data.orders;
  const [customer, setCustomer] = useState(data.customer);
  const [isOpenModalProfile, setIsOpenModalProfile] = useState(false);
  const [isOpenModalAddress, setIsOpenModalAddress] = useState(false);

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-2xl md:text-3xl mb-4">
          Xin chào {customer.firstName ?? ''}
        </h1>
        <Form method="post" action="/account/logout">
          <button type="submit" className="btn btn-primary">
            Đăng xuất
          </button>
        </Form>
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700 grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Thông tin tài khoản
          </h1>
          <AccountProfile
            customer={customer}
            onEdit={() => setIsOpenModalProfile(true)}
          />
          <EditProfileModal
            isOpen={isOpenModalProfile}
            onEditSuccess={(customer) => setCustomer(customer)}
            onClose={() => setIsOpenModalProfile(false)}
            customer={customer}
          />
        </div>
        <div>
          <h1 className="font-bold text-xl md:text-2xl mb-4">
            Thông tin nhận hàng
          </h1>
          <EditAddressModal
            isOpen={isOpenModalAddress}
            onEditSuccess={(customer) => setCustomer(customer)}
            onClose={() => setIsOpenModalAddress(false)}
            address={customer?.addresses?.edges[0]?.node}
          />
          <AccountAddress
            address={customer?.addresses?.edges[0]?.node}
            onEdit={() => setIsOpenModalAddress(true)}
          />
        </div>
      </section>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-xl md:text-2xl mb-4">Lịch sử đơn hàng</h1>
        <span className="text-copy max-w-prose whitespace-pre-wrap">
          {!orders?.length && 'Bạn chưa đặt đơn hàng nào!'}
          {orders?.length && <OrdersList orders={orders} />}
        </span>
      </section>
    </>
  );
}

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

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      phone
      email
      displayName
      acceptsMarketing
      addresses(first: 1) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
            phone
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  } 
`;

const CREATE_ADDRESS_MUTATION = `#graphql
mutation customerAddressCreate(
  $address: MailingAddressInput!
  $customerAccessToken: String!
) {
  customerAddressCreate(
    address: $address
    customerAccessToken: $customerAccessToken
  ) {
    customerAddress {
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

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: MailingAddressInput!
    $customerAccessToken: String!
    $id: ID!
  ) {
    customerAddressUpdate(
      address: $address
      customerAccessToken: $customerAccessToken
      id: $id
    ) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;
