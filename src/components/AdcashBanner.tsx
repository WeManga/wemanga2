// src/components/AdcashBanner.tsx
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    aclib?: any;
  }
}

interface AdcashBannerProps {
  zoneId: string;
  sub1?: string;
}

const AdcashBanner: React.FC<AdcashBannerProps> = ({ zoneId, sub1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Nettoyer au cas où
    containerRef.current.innerHTML = '';

    // Charger le script externe si besoin
    if (!document.getElementById('aclib')) {
      const libScript = document.createElement('script');
      libScript.id = 'aclib';
      libScript.src = '//acscdn.com/script/aclib.js';
      libScript.async = true;
      document.body.appendChild(libScript);

      libScript.onload = () => {
        injectRunBanner();
      };
    } else {
      injectRunBanner();
    }

    function injectRunBanner() {
      if (!containerRef.current) return;

      const inlineScript = document.createElement('script');
      inlineScript.type = 'text/javascript';

      const options: any = { zoneId };
      if (sub1) options.sub1 = sub1;

      inlineScript.innerHTML = `aclib && aclib.runBanner(${JSON.stringify(options)});`;

      containerRef.current.appendChild(inlineScript);
    }

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [zoneId, sub1]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', maxWidth: 468, height: 60, margin: 'auto', overflow: 'hidden', marginBottom: 24 }}
    />
  );
};

export default AdcashBanner;
