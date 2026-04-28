"use client";

import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function ShareButton() {
  const pathname = usePathname();

  const handleCopy = async () => {
    // Combine origin (http://localhost:3000) with the path (/blog/post-1)
    const url = `${window.location.origin}${pathname}`;

    try {
      await navigator.clipboard.writeText(url);
      toast("Copied to Clipboard");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95"
    >
      <Share2 size={20} />
    </button>
  );
}
// {pathname.includes("/article/") && (
//   <button onClick={CopyToClipboard} className="text-primary hover:bg-surface-container-low transition-colors p-2 rounded-full active:scale-95">
//     <Share2 size={20} />
//   </button>
// )}
