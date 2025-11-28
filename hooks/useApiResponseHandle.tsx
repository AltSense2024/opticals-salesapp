import { useState } from "react";

type ApiStatus = "loading" | "success" | "error" | "";

export const useApiResponseHandle = () => {
  const [status, setStatus] = useState<ApiStatus>("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [onPress, setOnPress] = useState<() => void>(
    () => () => setOpen(false)
  );

  const showModal = (
    status: ApiStatus,
    message: string,
    onPressAction?: () => void,
    autoCloseMs?: number
  ) => {
    setStatus(status);
    setMessage(message);
    setOpen(true);
    setOnPress(() => onPressAction || (() => setOpen(false)));
    if (autoCloseMs) {
      setTimeout(() => {
        setOpen(false);
        if (onPressAction) onPressAction();
      }, autoCloseMs);
    }
  };

  return {
    status,
    message,
    open,
    setOpen,
    onPress,
    showModal,
  };
};
