import {Form, useLoaderData} from '@remix-run/react';

export async function loader({context}) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
    },
  });

  return customer;
}

export const meta = () => {
  return [{title: 'Tài khoản'}];
};

export default function Account() {
  const customer = useLoaderData();

  console.log(customer);

  return (
    <>
      <section className="w-[92vw] mx-auto mt-8 text-green-700">
        <h1 className="font-bold text-2xl md:text-3xl mb-4">
          Xin chào, {customer.displayName}
        </h1>
        <Form method="post" action="/account/logout">
          <button type="submit" className="btn btn-primary">
            Đăng xuất
          </button>
        </Form>
      </section>
    </>
  );
}

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
      defaultAddress {
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
      addresses(first: 6) {
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
