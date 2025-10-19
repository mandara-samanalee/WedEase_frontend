import React from 'react';

interface DefaultButtonProps {
    handleClick?: () => void;
    className?: string;
    btnLabel: string;
    Icon?: React.ReactNode;
    disabled?: boolean;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({ handleClick, className = '', btnLabel, disabled, Icon }) => {
    return (
        <button
            onClick={handleClick}
            className={`w-[200px] bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition ${className}`}
            disabled={disabled}
        >
            {btnLabel}
            {Icon && <span className="ml-2">{Icon}</span>}
        </button>
    );
};

export default DefaultButton;



