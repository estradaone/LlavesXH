import { useEffect } from "react";

export default function useModalHotkeys({ isOpen, onConfirm, onCancel }) {
    useEffect(() => {
        if (!isOpen) return; // solo escucha si el modal está abierto

        const handleKeyDown = (e) => {
            if (e.key === "Enter" && onConfirm) {
                onConfirm();
            }
            if (e.key === "Escape" && onCancel) {
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onConfirm, onCancel]);
}
