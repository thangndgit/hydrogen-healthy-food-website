import {useEffect} from 'react';
import {useFetcher} from '@remix-run/react';
import {ToastContainer, toast} from 'react-toastify';
import PureModal from 'react-pure-modal';

export default function EditProfileModal({
  isOpen,
  onClose,
  onEditSuccess,
  width = '384px',
  customer,
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
      <EditProfile
        customer={customer}
        onEditSuccess={onEditSuccess}
        onClose={onClose}
      />
    </PureModal>
  );
}

function EditProfile({customer, onClose, onEditSuccess}) {
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
    fetcher?.data?.formSuccess,
    fetcher?.data?.customer,
    onEditSuccess,
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
          Cập nhật thông tin
        </h3>
        <div className="mt-3">
          <input type="hidden" name="actionType" value="update profiles" />
          <input
            className="border-primary/20 w-full"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Họ và tên đệm"
            aria-label="Họ và tên đệm"
            defaultValue={customer.lastName ?? ''}
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
            defaultValue={customer.firstName ?? ''}
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
            defaultValue={customer.phone ?? ''}
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="email"
            name="email"
            type="email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required
            placeholder="Địa chỉ email"
            aria-label="Địa chỉ email"
            defaultValue={customer.email ?? ''}
          />
        </div>
        <h3 className="mt-3 text-lead font-medium max-w-prose">Đổi mật khẩu</h3>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="Mật khẩu hiện tại"
            aria-label="Mật khẩu hiện tại"
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="newPassword"
            name="newPassword"
            type="password"
            minLength={8}
            maxLength={30}
            placeholder="Mật khẩu mới"
            aria-label="Mật khẩu mới"
          />
        </div>
        <div className="mt-3">
          <input
            className="border-primary/20 w-full"
            id="newPassword2"
            name="newPassword2"
            type="password"
            minLength={8}
            maxLength={30}
            placeholder="Xác nhận mật khẩu"
            aria-label="Xác nhận mật khẩu"
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
