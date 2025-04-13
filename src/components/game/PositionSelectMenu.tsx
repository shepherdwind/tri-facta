import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { CardPosition } from '../../game/types';
import { useTheme } from '../../hooks/useTheme';
import { GameStore } from '../../stores/GameStore';

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
    const store = GameStore.getInstance();

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

    const getPositionButton = (position: CardPosition, icon: React.ReactNode) => {
      const selectedCard = store.selectedCards.get(position);
      const isSelected = selectedCard !== undefined;
      const cardValue = selectedCard?.getValue();

      return (
        <button
          className={`block w-full text-left px-4 py-2 text-sm relative ${
            theme === 'dark'
              ? isSelected
                ? 'text-white bg-indigo-700 border-l-4 border-indigo-400'
                : 'text-gray-300 hover:bg-blue-900 hover:text-white'
              : isSelected
                ? 'text-indigo-900 bg-indigo-100 border-l-4 border-indigo-500'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'
          }`}
          onClick={() => onPositionSelect(position)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {icon}
              <span>{t(`game.position.${position}`)}</span>
            </div>
            {isSelected && cardValue !== null && (
              <div className="bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cardValue}
              </div>
            )}
          </div>
        </button>
      );
    };

    return (
      <div
        ref={menuRef}
        className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-36 rounded-md shadow-lg ring-2 ring-black ring-opacity-5 focus:outline-none z-50 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="py-1">
          {getPositionButton(CardPosition.TOP, <TopIcon />)}
          {getPositionButton(CardPosition.BOTTOM_LEFT, <BottomLeftIcon />)}
          {getPositionButton(CardPosition.BOTTOM_RIGHT, <BottomRightIcon />)}
        </div>
      </div>
    );
  }
);
