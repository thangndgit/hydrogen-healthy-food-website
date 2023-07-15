export default function AccountProfile({customer, onEdit}) {
  return (
    <div className="grid w-full gap-4 md:gap-8">
      <div className="lg:p-8 p-6 border border-gray-200 rounded">
        <div className="flex">
          <h3 className="font-bold text-base flex-1">Tài khoản và mật khẩu</h3>
          <div
            onClick={onEdit}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
            className="underline"
          >
            Chỉnh sửa
          </div>
        </div>
        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Tên hiển thị
        </div>
        <p className="mt-1">
          {customer.lastName || customer.firstName
            ? (customer.lastName ? customer.lastName + ' ' : '') +
              customer.firstName
            : 'Chưa đặt'}{' '}
        </p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Số điện thoại
        </div>
        <p className="mt-1">{customer.phone ?? 'Chưa đặt'}</p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Địa chỉ email
        </div>
        <p className="mt-1">{customer.email ?? 'Chưa đặt'}</p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Mật khẩu
        </div>
        <p className="mt-1">**************</p>
      </div>
    </div>
  );
}
