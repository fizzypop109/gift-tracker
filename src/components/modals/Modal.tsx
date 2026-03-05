import {ReactNode} from "react";
import { ModalProps as ModalPropsBase } from "@/types";

type ModalProps = ModalPropsBase & {
    title: string;
    children: ReactNode;
    width?: number;
}

export const Modal = ({ open, onClose, title, children, width }: ModalProps) => {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{animation: "backdropFadeIn .2s ease"}}
            className="fixed inset-0 bg-brown/45 backdrop-blur-md flex items-end justify-center z-[1000]"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="bg-surface rounded-t-2xl pt-6 px-5 pb-5 w-full max-h-[90vh] overflow-auto shadow-[0_-10px_40px_rgba(30,20,10,0.2)] border border-cream-subtle border-b-0"
                style={{
                    maxWidth: width || 440,
                    animation: "slideUp .3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
            >
                <div className="w-9 h-1 rounded bg-tan mx-auto mb-4" />

                {title && <h2 className="font-fraunces text-xl font-bold text-brown m-0 mb-4">{title}</h2>}

                {children}
            </div>
        </div>
    );
}
