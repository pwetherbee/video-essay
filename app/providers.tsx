"use client";

import { ToastContainer } from "react-toastify";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  );
}
