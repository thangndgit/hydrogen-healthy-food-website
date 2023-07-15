export default function AccountAddress({address = {}, onEdit}) {
  return (
    <div className="grid w-full gap-4 md:gap-8">
      <div className="lg:p-8 p-6 border border-gray-200 rounded">
        <div className="flex">
          <h3 className="font-bold text-base flex-1">Địa chỉ và liên lạc</h3>
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
          Tên người nhận
        </div>
        <p className="mt-1">
          {address?.lastName || address?.firstName
            ? (address?.lastName ? address?.lastName + ' ' : '') +
              address?.firstName
            : 'Chưa đặt'}
        </p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Số điện thoại
        </div>
        <p className="mt-1">{address?.phone ?? 'Chưa đặt'}</p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Thành phố
        </div>
        <p className="mt-1">{address?.city ?? 'Chưa đặt'}</p>

        <div className="mt-4 text-sm text-primary/50 font-semibold">
          Địa chỉ
        </div>
        <p className="mt-1">{address?.address1 ?? 'Chưa đặt'}</p>

        {/* <div className="mt-4 text-sm text-primary/50 font-semibold">
          Địa chỉ dự phòng
        </div>
        <p className="mt-1">{address?.address2 ?? 'Chưa đặt'}</p> */}
      </div>
    </div>
  );
}
