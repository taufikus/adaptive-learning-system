import { useEffect } from "react";

const Modal = ({
    isOpen,
    onAfterOpen,
    onAfterClose,
    onRequestClose,
    children
  }) => {

    useEffect(() => {
        if (isOpen) {
          onAfterOpen?.();
        } else {
          onAfterClose?.();
        }
      }, [isOpen, onAfterOpen, onAfterClose]);
    
      if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50  flex items-center justify-center bg-opacity-50">
   
        {children}
     
    </div>
  )
}

export default Modal