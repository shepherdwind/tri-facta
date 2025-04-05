import React, { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ToastOptions } from '../utils/ToastManager';

interface ToastProps extends ToastOptions {
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  status = 'info',
  duration = 3000,
  isClosable = true,
  position = 'top',
  variant = 'solid',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'subtle':
        return 'bg-opacity-10';
      case 'left-accent':
        return 'border-l-4 border-current';
      case 'top-accent':
        return 'border-t-4 border-current';
      case 'solid':
      default:
        return '';
    }
  };

  const getPositionClass = () => {
    return position === 'top' ? 'top-4' : 'bottom-4';
  };

  return (
    <Transition
      show={isVisible}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`fixed right-4 ${getPositionClass()} z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden ${getStatusColor()} ${getVariantStyle()}`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-1">
              {title && <p className="text-sm font-medium">{title}</p>}
              <p className="mt-1 text-sm">{description}</p>
            </div>
            {isClosable && (
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className="inline-flex text-white focus:outline-none"
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};
