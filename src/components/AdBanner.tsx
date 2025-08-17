import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  id: string;
  className?: string;
}

// Mapping entre id et zoneId Adcash (à adapter selon tes zones)
const zoneIds: { [key: string]: string } = {
  homeTop: '10295018',
  homeClassics: '10295018',
  homeCatalog: '10295018',
  homeBottom: '10295018',
  seriesTop: '10295018',
  seriesBottom: '10295018',
  filmsTop: '10295018',
  filmsBottom: '10295018',
  playerTop: '10295018',
  playerBottom: '10295018',
};

const AdBanner: React.FC<AdBannerProps> = ({ id, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoneId = zoneIds[id];

  useEffect(() => {
    if (!zoneId) return;

    // Charger la librairie Adcash si non présente
    if (!window.aclib) {
      const scriptLib = document.createElement('script');
      scriptLib.id = 'aclib';
      scriptLib.src = '//acscdn.com/script/aclib.js';
      scriptLib.async = true;
      document.body.appendChild(scriptLib);

      scriptLib.onload = () => {
        if (window.aclib && containerRef.current) {
          window.aclib.runBanner({ zoneId });
        }
      };
    } else {
      if (window.aclib && containerRef.current) {
        window.aclib.runBanner({ zoneId });
      }
    }

    // Nettoyage : vider le container au démontage
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [zoneId]);

  if (!zoneId) return null;

  return (
    <div
      ref={containerRef}
      className={`w-full flex justify-center my-6 ${className || ''}`}
      style={{ width: 468, height: 60, overflow: 'hidden' }}
    />
  );
};

export default AdBanner;
