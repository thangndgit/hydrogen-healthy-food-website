import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import {ToastContainer, toast} from 'react-toastify';
import PureModal from 'react-pure-modal';

export default function EditAddressModal({
  isOpen,
  onClose,
  onEditSuccess,
  width = '384px',
  address = {},
}) {
  return (
    <PureModal
      isOpen={isOpen}
      width={width}
      scrollable={true}
      onClose={() => {
        onClose();
        return true;
      }}
    >
      <EditAddress
        address={address}
        onClose={onClose}
        onEditSuccess={onEditSuccess}
      />
    </PureModal>
  );
}

function EditAddress({address = {}, onClose, onEditSuccess}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher?.data?.formError) {
      toast.error(fetcher?.data?.formError, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  }, [fetcher?.data?.formError, fetcher?.data?.timeError]);

  useEffect(() => {
    if (fetcher?.data?.formSuccess) {
      const customer = fetcher?.data?.customer;
      if (customer) onEditSuccess(customer);
      onClose();
    }
  }, [
    onClose,
    onEditSuccess,
    fetcher?.data?.formSuccess,
    fetcher?.data?.customer,
  ]);

  return (
    <>
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
      <fetcher.Form
        method="post"
        action="/account"
        className="form mx-auto max-w-prose"
      >
        <h3 className="mt-3 text-lead font-medium max-w-prose">
          Cập nhật thông tin nhận hàng
        </h3>
        <div className="mt-3">
          <input type="hidden" name="actionType" value="update address" />
          <input type="hidden" name="addressExist" value={!!address?.id} />
          <input type="hidden" name="addressId" value={address?.id} />
          <input
            className="border-primary/20 w-full"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Họ và tên đệm"
            aria-label="Họ và tên đệm"
            defaultValue={address?.lastName ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Tên"
            aria-label="Tên"
            defaultValue={address?.firstName ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="phone"
            name="phone"
            type="tel"
            placeholder="Số điện thoại"
            aria-label="Số điện thoại"
            defaultValue={address?.phone ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="company"
            name="company"
            type="text"
            placeholder="Công ty"
            aria-label="Công ty"
            defaultValue={address?.company ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="address1"
            name="address1"
            type="text"
            required
            placeholder="Địa chỉ chính"
            aria-label="Địa chỉ chính"
            defaultValue={address?.address1 ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="address2"
            name="address2"
            type="text"
            placeholder="Địa chỉ dự phòng"
            aria-label="Địa chỉ dự phòng"
            defaultValue={address?.address2 ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="city"
            name="city"
            type="text"
            placeholder="Thành phố"
            aria-label="Thành phố"
            defaultValue={address?.city ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="province"
            name="province"
            type="text"
            placeholder="Tỉnh"
            aria-label="Tỉnh"
            defaultValue={address?.province ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="zip"
            name="zip"
            type="text"
            placeholder="Mã bưu chính"
            aria-label="Mã bưu chính"
            defaultValue={address?.zip ?? ''}
          />
        </div>
        <div className="mt-6">
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={fetcher?.state !== 'idle'}
          >
            {fetcher?.state !== 'idle' ? 'Đang lưu' : 'Lưu lại'}
          </button>
        </div>
        <div className="mb-4">
          <button
            className="btn btn-outline-primary w-full"
            onClick={onClose}
            disabled={fetcher?.state !== 'idle'}
          >
            Hủy
          </button>
        </div>
      </fetcher.Form>
    </>
  );
}
