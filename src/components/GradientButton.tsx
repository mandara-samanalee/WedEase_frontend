import React from 'react';

interface GradientButtonProps {
  handleClick?: () => void;
  className?: string;
  btnLabel: string;
  Icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ handleClick, className = '', btnLabel, Icon }) => {
  return (
    <button
      onClick={handleClick}
      className={`bg-gradient-to-r from-purple-400 to-purple-600 text-white font-inter font-semibold py-2 px-4 rounded hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-400 ${className}`}
    >
      {btnLabel}
      {Icon && <span className="ml-2">{Icon}</span>}
    </button>
  );
};

export default GradientButton;

