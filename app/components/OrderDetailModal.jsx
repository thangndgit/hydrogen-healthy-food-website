import PureModal from 'react-pure-modal';

export default function OrderDetailModal({
  isOpen,
  onClose,
  width = '384px',
  order,
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
      <div>hihi</div>
      <div>{JSON.stringify(order)}</div>
    </PureModal>
  );
}
