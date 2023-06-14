import ReactModal from 'react-modal';

export default function ForgetPasswordModal({isOpen, onClose}) {
  return (
    <ReactModal isOpen={isOpen} onRequestClose={onClose} contentLabel="Example">
      <h2>Modal Title</h2>
      <p>Modal Content</p>
      <button onClick={onClose}>Đóng Modal</button>
    </ReactModal>
  );
}
