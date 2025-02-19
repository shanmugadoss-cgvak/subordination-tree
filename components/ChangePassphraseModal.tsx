"use client";

import React, { useState, useEffect } from "react";

interface ChangePassphraseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, parentUserId: string) => Promise<string>;
  userId: string | null;
  parentUserId: string | null;
  newPassphrase: string | null;
}

const ChangePassphraseModal: React.FC<ChangePassphraseModalProps> = ({ isOpen, onClose, onConfirm, userId, parentUserId, newPassphrase }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (userId && parentUserId) {
      setLoading(true);
      await onConfirm(userId, parentUserId);
      setLoading(false);
    }
  };

  const handleCopyPassphrase = () => {
    if (newPassphrase) {
      navigator.clipboard.writeText(newPassphrase);
      setCopied(true);
    }
  };

  return (
    <dialog id="change-passphrase-modal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">Change Passphrase</h3>
        {newPassphrase ? (
          <div role="alert" className="alert mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>New Passphrase: <strong>{newPassphrase}</strong></span>
          </div>
        ) : (
          <p className="py-4">Do you want to change the passphrase for the user?</p>
        )}
        <div className="modal-action">
          {newPassphrase ? (
            <button onClick={handleCopyPassphrase} className="btn btn-sm btn-primary" disabled={copied}>
              {copied ? "Copied" : "Copy Passphrase"}
            </button>
          ) : (
            <button onClick={handleConfirm} className={`btn btn-sm btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Loading..." : "Yes"}
            </button>
          )}
          <button onClick={onClose} className="btn btn-sm" disabled={loading}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default ChangePassphraseModal;