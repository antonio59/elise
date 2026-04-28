import React from "react";
import { Mail, Lock, User } from "lucide-react";

interface AuthFormFieldsProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  name?: string;
  onNameChange?: (value: string) => void;
}

const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  name,
  onNameChange,
}) => {
  return (
    <>
      {onNameChange !== undefined && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="input pl-10"
              placeholder="Your name"
              required
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="input pl-10"
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="input pl-10"
            placeholder={onNameChange !== undefined ? "At least 8 characters" : "Your password"}
            minLength={onNameChange !== undefined ? 8 : undefined}
            required
          />
        </div>
      </div>
    </>
  );
};

export default AuthFormFields;
