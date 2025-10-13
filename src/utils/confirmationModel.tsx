"use client";

import React, { useEffect } from "react";

export type ConfirmModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title?: string;
    message?: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    disableOutsideClose?: boolean;
    variant?: "danger" | "default";
};

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Delete account?",
    message = "This action cannot be undone. Are you sure you want to proceed?",
    confirmText = "Delete",
    cancelText = "Cancel",
    disableOutsideClose = false,
    variant = "danger",
}: ConfirmModalProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && open) onClose();
        };
        document.addEventListener("keydown", onKey);
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = prev;
                document.removeEventListener("keydown", onKey);
            };
        }
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const confirmBtnClasses =
        variant === "danger"
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-purple-600 hover:bg-purple-700 text-white";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={() => {
                if (!disableOutsideClose) onClose();
            }}
        >
            <div
                className="w-full max-w-sm rounded-lg bg-white shadow-lg p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 id="confirm-title" className="text-lg font-semibold mb-2">
                    {title}
                </h3>
                {message && <div className="text-sm text-gray-600 mb-6">{message}</div>}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg ${confirmBtnClasses} disabled:opacity-60`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
} 
