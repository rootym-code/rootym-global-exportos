"use client";

import { useState } from "react";

import RCaptainLauncher from "./RCaptainLauncher";
import RCaptainPanel from "./RCaptainPanel";

export default function RCaptainWidget() {
  const [isOpen, setIsOpen] = useState(false);

  function openPanel() {
    setIsOpen(true);
  }

  function closePanel() {
    setIsOpen(false);
  }

  function togglePanel() {
    setIsOpen((previous) => !previous);
  }

  return (
    <>
      <RCaptainPanel
        open={isOpen}
        onClose={closePanel}
      />

      <RCaptainLauncher
        onClick={togglePanel}
      />
    </>
  );
}

// END OF FILE