import React from "react";
import ModalShell from "../ModalShell";

interface ArtworkModalShellProps {
  isOpen: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ArtworkModalShell: React.FC<ArtworkModalShellProps> = ({
  isOpen,
  title,
  closeLabel,
  onClose,
  children,
}) => {
  return (
    <ModalShell
      isOpen={isOpen}
      title={title}
      closeLabel={closeLabel}
      onClose={onClose}
    >
      {children}
    </ModalShell>
  );
};

export default ArtworkModalShell;
