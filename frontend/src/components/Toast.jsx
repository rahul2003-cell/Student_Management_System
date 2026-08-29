import React, { useEffect } from 'react';
import { LuCircleCheck, LuCircleAlert } from 'react-icons/lu';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast ${toast.type === 'error' ? 'error' : ''}`}>
      {toast.type === 'error' ? <LuCircleAlert /> : <LuCircleCheck />}
      {toast.message}
    </div>
  );
}
