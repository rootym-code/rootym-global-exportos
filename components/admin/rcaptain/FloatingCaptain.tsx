"use client";

import { useEffect, useState } from "react";

import CaptainCard from "./CaptainCard";
import CaptainPanel from "./CaptainPanel";

import { RCaptainData } from "@/lib/services/dashboard/dashboard.types";

type FloatingCaptainProps = {
  data: RCaptainData;
};

export default function FloatingCaptain({
  data,
}: FloatingCaptainProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {!open && (
        <CaptainCard
          title={data.captain.title}
          message={data.captain.message}
          recommendation={data.captain.recommendation}
          severity={data.captain.severity}
          unread={data.captain.unread}
          lastUpdated={data.captain.lastUpdated}
          onClick={() => setOpen(true)}
        />
      )}
<CaptainPanel
  open={open}
  onClose={() => setOpen(false)}
  title={data.captain.title}
  message={data.captain.message}
  recommendation={data.captain.recommendation}
  businessHealth={data.businessHealth}
/>
    </>
  );
}