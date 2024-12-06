import React from 'react';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ThankYouModal = ({ isOpen, onClose }) => {
  const { width, height } = useWindowSize();

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-90 pointer-events-none">
          <ReactConfetti width={width} height={height} />
        </div>
      )}
      
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-10 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center">
                Terima Kasih atas Kontribusi Anda
              </h2>
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Kontribusi Anda telah berhasil dikirim. Kami akan menghubungi Anda melalui WhatsApp untuk informasi lebih lanjut.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankYouModal;
