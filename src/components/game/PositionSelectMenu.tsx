import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { CardPosition } from '../../game/types';
import { useTheme } from '../../hooks/useTheme';

interface PositionSelectMenuProps {
  onPositionSelect: (position: CardPosition) => void;
  onClose: () => void;
}

// Direction icons as SVG components
export const TopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4L4 20L20 20L12 4Z"
    />
    <circle cx="12" cy="4" r="3" fill="#3B82F6" />
  </svg>
);

export const BottomLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4L4 20L20 20L12 4Z"
    />
    <circle cx="4" cy="20" r="3" fill="#3B82F6" />
  </svg>
);

export const BottomRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 inline mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4L4 20L20 20L12 4Z"
    />
    <circle cx="20" cy="20" r="3" fill="#3B82F6" />
  </svg>
);

export const PositionSelectMenu: React.FC<PositionSelectMenuProps> = observer(
  ({ onPositionSelect, onClose }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    return (
      <div
        ref={menuRef}
        className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 rounded-md shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none z-50 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="py-1">
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.TOP)}
          >
            <TopIcon /> {t('game.position.top')}
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.BOTTOM_LEFT)}
          >
            <BottomLeftIcon /> {t('game.position.bottomLeft')}
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-gray-300 hover:bg-blue-900 hover:text-white'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
            }`}
            onClick={() => onPositionSelect(CardPosition.BOTTOM_RIGHT)}
          >
            <BottomRightIcon /> {t('game.position.bottomRight')}
          </button>
        </div>
      </div>
    );
  }
);
