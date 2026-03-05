import {useRef, useState, useCallback} from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;
}

export const Modal = ({open, onClose, title, children, width}: ModalProps) => {
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const startY = useRef(0);
    const panelRef = useRef<HTMLDivElement>(null);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        setDragging(true);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!dragging) return;
        const delta = e.touches[0].clientY - startY.current;
        setDragY(Math.max(0, delta)); // only allow dragging down
    }, [dragging]);

    const handleTouchEnd = useCallback(() => {
        setDragging(false);
        if (dragY > 120) {
            onClose();
        }
        setDragY(0);
    }, [dragY, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-end justify-center z-[1000]">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-brown/45 backdrop-blur-md flex items-end justify-center"
                style={{
                    animation: "backdropFadeIn .2s ease",
                    opacity: dragging ? 1 - dragY / 400 : undefined,
                }}
            />

            <div
                ref={panelRef}
                onClick={e => e.stopPropagation()}
                className="relative bg-surface rounded-t-2xl pt-0 px-5 pb-5 w-full max-h-[90vh] overflow-auto shadow-[0_-10px_40px_rgba(30,20,10,0.2)] border border-cream-subtle border-b-0"
                style={{
                    maxWidth: width || 440,
                    animation: dragging ? "none" : "slideUp .3s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
                    transition: dragging ? "none" : "transform .3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                {/* Drag handle */}
                <div
                    className="pt-3 pb-4 cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="w-9 h-1 rounded bg-tan mx-auto"/>
                </div>

                {title && <h2 className="font-fraunces text-xl font-bold text-brown m-0 mb-4">{title}</h2>}
                {children}
            </div>
        </div>
    );
};