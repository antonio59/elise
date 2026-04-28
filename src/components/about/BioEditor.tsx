import React from "react";

interface BioEditorProps {
  bio: string;
  setBio: (bio: string) => void;
}

const BioEditor: React.FC<BioEditorProps> = ({ bio, setBio }) => {
  return (
    <div className="card p-6">
      <h2 className="font-bold text-slate-800 mb-4">Bio</h2>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="input h-24 resize-none"
        placeholder="Tell people about yourself..."
      />
    </div>
  );
};

export default BioEditor;
