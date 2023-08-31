import React from "react";
import { Modal } from "@mui/material";

// Custom hook for using modal
export function useModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [message, setMessage] = React.useState({});

  const openModal = (newMessage) => {
    setMessage(newMessage);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    message,
    openModal,
    closeModal,
  };
}

const MessageBox = ({ isOpen, onConfirm, onCancel, message }) => {
  const handleButtonClick = (callback) => () => {
    if (callback) {
      callback();
    }
  };

  return (
    <Modal open={isOpen} onClose={handleButtonClick(onCancel)}>
      <div
        className="flex flex-col w-auto bg-white justify-center items-center absolute top-1/2 left-1/2 gap-y-2 rounded-lg border p-8"
        style={{
          transform: "translate(-50%, -50%)",
          minWidth: "250px",
        }}
      >
        <div className="flex flex-col gap-y-2 text-gray-800 items-center">
          {message.title && <h2 className="font-semibold">{message.title}</h2>}
          {message.subTitle && (
            <h2 className="font-semibold">{message.subTitle}</h2>
          )}
          {message.context && (
            <h2 className="font-semibold">{message.context}</h2>
          )}
        </div>
        <div className="flex justify-center gap-x-5 mt-5">
          {message.confirmButtonText && (
            <button
              className="bg-red-500 hover:bg-red-700 text-white rounded py-2 px-4 text-sm"
              style={{ minWidth: "100px" }}
              onClick={handleButtonClick(onConfirm)}
            >
              {message.confirmButtonText}
            </button>
          )}
          {message.cancelButtonText && (
            <button
              className="bg-gray-300 hover:bg-gray-500 rounded py-2 px-4 mr-4 text-sm"
              style={{ minWidth: "100px" }}
              onClick={handleButtonClick(onCancel)}
            >
              {message.cancelButtonText}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MessageBox;
