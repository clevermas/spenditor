import { useEffect, useRef } from 'react';
import { close, ModalData } from "@/redux/features/modal.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useErrorToastHandler } from "./use-error-toast-handler";

export function useTransactionModal(modalType, mutation, onOpen, onClose): [boolean, ModalData] {
    const dispatch = useAppDispatch();
    const { type, isOpen, data } = useAppSelector((state) => state.modalReducer);
    const [_, mutationResult] = mutation;

    const isModalOpen = !!(isOpen && type && type === modalType);
    const isSuccess = mutationResult.status === "fulfilled";

    const onOpenRef = useRef(onOpen);
    const onCloseRef = useRef(onClose);

    useErrorToastHandler(mutationResult?.error);
    
    useEffect(() => {
        if (isModalOpen) {
            onOpenRef.current(data);
        } else {
            onCloseRef.current();
        }
    }, [isModalOpen, data]);

    useEffect(() => {
        if (isSuccess && isModalOpen) {
            mutationResult?.reset();
            dispatch(close());
        }
    }, [isModalOpen, isSuccess, mutationResult, dispatch]);

    return [isModalOpen, data];
}
