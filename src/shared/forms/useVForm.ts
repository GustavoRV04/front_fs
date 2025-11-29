import { useCallback, useState } from "react";
import { UseFormHandleSubmit } from "react-hook-form";

interface UseVFormProps {
    handleSubmit: UseFormHandleSubmit<any>;
    onSave: (data: any) => Promise<void>;
    onSaveAndNew?: (data: any) => Promise<void>;
    onSaveAndClose?: (data: any) => Promise<void>;
}

export const useVForm = ({
    handleSubmit,
    onSave,
    onSaveAndNew,
    onSaveAndClose
}: UseVFormProps) => {
    const [isSaveAndNew, setIsSaveAndNew] = useState(false);
    const [isSaveAndClose, setIsSaveAndClose] = useState(false);

    const handleSave = useCallback(() => {
        setIsSaveAndNew(false);
        setIsSaveAndClose(false);
        handleSubmit(async (data) => {
            await onSave(data);
        })();
    }, [handleSubmit, onSave]);

    const handleSaveAndNew = useCallback(() => {
        setIsSaveAndNew(true);
        setIsSaveAndClose(false);
        handleSubmit(async (data) => {
            await onSave(data);
            if (onSaveAndNew) {
                await onSaveAndNew(data);
            }
        })();
    }, [handleSubmit, onSave, onSaveAndNew]);

    const handleSaveAndClose = useCallback(() => {
        setIsSaveAndNew(false);
        setIsSaveAndClose(true);
        handleSubmit(async (data) => {
            await onSave(data);
            if (onSaveAndClose) {
                await onSaveAndClose(data);
            }
        })();
    }, [handleSubmit, onSave, onSaveAndClose]);

    const handleIsSaveAndNew = useCallback(() => isSaveAndNew, [isSaveAndNew]);
    const handleIsSaveAndClose = useCallback(() => isSaveAndClose, [isSaveAndClose]);

    return {
        handleSave,
        handleSaveAndNew,
        handleSaveAndClose,
        handleIsSaveAndNew,
        handleIsSaveAndClose
    };
};