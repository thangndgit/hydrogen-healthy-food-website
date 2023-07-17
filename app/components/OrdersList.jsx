/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable hydrogen/prefer-image-component */

import {Link} from '@remix-run/react';
import {Money, flattenConnection} from '@shopify/hydrogen-react';
import {dateToDateTimeString} from '~/utils/converters';
import OrderDetailModal from '~/components/OrderDetailModal';
import {useState} from 'react';

export default function OrdersList({orders}) {
  const [currentOrder, setCurrentOrder] = useState(orders[0]);
  const [isOpenModalOrder, setIsOpenModalOrder] = useState(false);

  return (
    <>
      <OrderDetailModal
        order={currentOrder}
        isOpen={isOpenModalOrder}
        onClose={() => setIsOpenModalOrder(false)}
        orderId
      />
      <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
        {orders.map((order) => (
          <OrderCard
            order={order}
            key={order.id}
            onOpen={() => {
              setCurrentOrder(order);
              setIsOpenModalOrder(true);
            }}
          />
        ))}
      </ul>
    </>
  );
}

export function OrderCard({order, onOpen}) {
  if (!order?.id) return null;
  // const [legacyOrderId, key] = order.id.split('/').pop().split('?');
  const lineItems = flattenConnection(order?.lineItems);

  return (
    <li
      className="grid text-center border rounded cursor-pointer"
      onClick={onOpen}
    >
      <div className="grid items-center gap-4 p-4 md:gap-6 md:p-6 md:grid-cols-2">
        {lineItems[0].variant?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <img
              width={168}
              height={168}
              className="w-full fadeIn cover"
              alt={lineItems[0].variant?.image?.altText ?? 'Order image'}
              src={lineItems[0].variant?.image.url}
            />
          </div>
        )}
        <div
          className={`flex-col justify-center text-left ${
            !lineItems[0].variant?.image && 'md:col-span-2'
          }`}
        >
          <h3 className="font-bold text-copy max-w-prose mb-2">
            Đơn số {order.orderNumber}
          </h3>
          <dl className="grid">
            <dt className="sr-only">Tổng tiền</dt>
            <dd className="mb-2">
              <span className="subpixel-antialiased text-fine">
                <Money data={order?.currentTotalPrice} />
              </span>
            </dd>
            <dt className="sr-only">Ngày đặt</dt>
            <dd>
              <span className="subpixel-antialiased text-fine whitespace-nowrap">
                {dateToDateTimeString(new Date(order.processedAt))}
              </span>
            </dd>
            <dt className="sr-only">Trạng thái đơn hàng</dt>
            <dd className="mt-2">
              <span
                className={`text-xs font-medium rounded-full ${
                  order.fulfillmentStatus === 'FULFILLED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-primary/5 text-primary/50'
                }`}
              >
                <span className="subpixel-antialiased text-fine">
                  {order.fulfillmentStatus}
                </span>
              </span>
            </dd>
          </dl>
        </div>
      </div>
      <div className="self-end border-t">
        <div className="block w-full p-2 text-center">
          <span className="ml-3 text-copy">Xem chi tiết</span>
        </div>
      </div>
    </li>
  );
}
