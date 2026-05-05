"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";

export function CopyLinkButton({ groupId }: { groupId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Generate the invite link using the current window location origin
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const inviteLink = `${origin}/grupos/${groupId}/entrar`;

    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        copied
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-brand-100 text-brand-700 hover:bg-brand-200"
      }`}
    >
      {copied ? <Check size={18} /> : <LinkIcon size={18} />}
      {copied ? "Copiado!" : "Copiar Link de Convite"}
    </button>
  );
}
