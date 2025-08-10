import React from 'react';

interface AdBannerProps {
  id: string;
  className?: string;
}

const urls: { [key: string]: string } = {
  homeTop: 'https://otieu.com/4/9691962',
  homeClassics: 'https://otieu.com/4/9691962',
  homeCatalog: 'https://otieu.com/4/9691962',
  homeBottom: 'https://otieu.com/4/9691962',
  seriesTop: 'https://otieu.com/4/9692384',
  seriesBottom: 'https://otieu.com/4/9692384',
  filmsTop: 'https://otieu.com/4/9692384',
  filmsBottom: 'https://otieu.com/4/9692384',
  playerTop: 'https://otieu.com/4/9692384',
  playerBottom: 'https://otieu.com/4/9692384',
};

const AdBanner: React.FC<AdBannerProps> = ({ id, className }) => {
  const url = urls[id];
  if (!url) return null;

  return (
    <div className={`w-full flex justify-center my-6 ${className || ''}`}>
      <iframe
        src={url}
        width="728"
        height="90"
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
        frameBorder="0"
        allow="autoplay"
      />
    </div>
  );
};

export default AdBanner;
