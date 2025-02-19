"use client";

import React, { useState, useEffect } from "react";
import { generatePassphrase } from "@/lib/generatePassphrase";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newPassphrase: string) => Promise<void>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [loading, setLoading] = useState(false);
  const [newPassphrase, setNewPassphrase] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setNewPassphrase(null);
    }
  }, [isOpen]);

  const handleCreate = async () => {
    const passphrase = generatePassphrase();
    setNewPassphrase(passphrase);
    setLoading(true);
    await onCreate(passphrase);
    setLoading(false);
  };

  const handleCopyPassphrase = () => {
    if (newPassphrase) {
      navigator.clipboard.writeText(newPassphrase);
      setCopied(true);
    }
  };

  return (
    <dialog id="create-user-modal" className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-2">Create New User</h3>
        {newPassphrase ? (
          <div role="alert" className="alert alert-success mt-4">
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
          <p className="py-4">Are you sure you want to create a new user?</p>
        )}
        <div className="modal-action">
          {newPassphrase ? (
            <button onClick={handleCopyPassphrase} className="btn btn-sm btn-primary" disabled={copied}>
              {copied ? "Copied" : "Copy Passphrase"}
            </button>
          ) : (
            <button onClick={handleCreate} className={`btn btn-sm btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? "Loading..." : "Create"}
            </button>
          )}
          <button onClick={onClose} className="btn btn-sm" disabled={loading}>Close</button>
        </div>
      </div>
    </dialog>
  );
};

export default CreateUserModal;