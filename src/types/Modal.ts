export type ModalState<T> =
    | { open: false }
    | { open: true; initial: T | null }; // null = new, T = editing