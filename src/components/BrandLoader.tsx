"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type BrandLoaderProps = {
  context?: "application" | "page";
};

export default function BrandLoader({ context = "page" }: BrandLoaderProps) {
  const [takingLonger, setTakingLonger] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setTakingLonger(true), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  const isApplication = context === "application";

  return (
    <div className={`brand-loader ${isApplication ? "brand-loader--inline" : "brand-loader--page"}`} role="status" aria-live="polite" aria-busy="true">
      <div className="brand-loader__panel">
        <div className="brand-loader__mark" aria-hidden="true">
          <span className="brand-loader__orbit" />
          <Image src="/logo-transparent.png" alt="" width={44} height={44} priority className="brand-loader__logo" />
        </div>
        <div className="brand-loader__content">
          <p className="brand-loader__title">{isApplication ? "Sending your application" : "Getting everything ready"}</p>
          <p className="brand-loader__message">
            {takingLonger
              ? isApplication
                ? "This is taking longer than usual. Please keep this page open and avoid submitting again."
                : "This is taking a little longer than usual. Please stay on this page."
              : isApplication
                ? "Please keep this page open while we process your details."
                : "Please wait a moment."}
          </p>
          <div className="brand-loader__track" aria-hidden="true"><span /></div>
        </div>
      </div>
    </div>
  );
}
