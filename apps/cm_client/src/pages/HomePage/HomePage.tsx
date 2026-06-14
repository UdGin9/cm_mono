import React, { useState, useRef } from "react";
import s from './HomePage.module.scss';

const CAMERA_COUNT = 4;
const BASE_URL_PI5 = import.meta.env.VITE_BASE_RASPBERRY_5_URL;
const BASE_URL_PI3 = import.meta.env.VITE_BASE_RASPBERRY_3_URL;

const CAMERA_LABELS = [
  'ГОЛОВНОЙ ВАГОН',
  'ПРОМЕЖУТОЧНЫЙ ВАГОН',
  'ПРОМЕЖУТОЧНЫЙ ВАГОН',
  'КОНЦЕВОЙ ВАГОН',
];

const getCameraUrl = (i: number): string => {
  if (i === 0 || i === 1) return `${BASE_URL_PI5}/cam${i}`;
  if (i === 2 || i === 3) return `${BASE_URL_PI3}/cam${i - 2}`;
  throw new Error(`Неподдерживаемый индекс камеры: ${i}`);
};

interface CameraBlockProps {
  index: number;
  fullscreen?: boolean;
  onClick: () => void;
}

const CameraBlock: React.FC<CameraBlockProps> = ({ index, fullscreen, onClick }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [resolution, setResolution] = useState<string>('');
  const [hasVideo, setHasVideo] = useState<boolean>(false);

  const handleLoad = () => {
    if (imgRef.current) {
      setResolution(`${imgRef.current.naturalWidth}×${imgRef.current.naturalHeight}`);
    }
    setHasVideo(true);
  };

  const handleError = () => setHasVideo(false);

  return (
    <div className={fullscreen ? s.fullscreenCamera : s.cameraContainer} onClick={onClick}>
      <img
        ref={imgRef}
        src={getCameraUrl(index)}
        className={fullscreen ? s.cameraFeedFull : s.cameraFeed}
        alt=""
        onLoad={handleLoad}
        onError={handleError}
      />

      {!hasVideo && <div className={s.noVideo}>Нет видео</div>}

      <span className={`${s.corner} ${s.cornerTl}`} />
      <span className={`${s.corner} ${s.cornerTr}`} />
      <span className={`${s.corner} ${s.cornerBl}`} />
      <span className={`${s.corner} ${s.cornerBr}`} />

      <div className={s.overlayTop}>
        <div className={s.camInfo}>
          <span className={s.camBadge}>CAM {String(index + 1).padStart(2, '0')}</span>
          <div className={s.camTitles}>
            <span className={s.camTitle}>Камера {index + 1}</span>
            <span className={s.camSubtitle}>{CAMERA_LABELS[index]}</span>
          </div>
        </div>
        <div className={s.motionIndicator}>
          <span className={s.motionDot} />
          <span className={s.motionText}>MOTION</span>
        </div>
      </div>

      <div className={s.overlayBottom}>
        <span className={s.resolution}>{resolution || '—'}</span>
      </div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const toggle = (i: number) => setSelectedCamera(selectedCamera === i ? null : i);

  return (
    <>
      {selectedCamera === null ? (
        <div className={s.cameraGrid}>
          {Array.from({ length: CAMERA_COUNT }).map((_, i) => (
            <CameraBlock key={i} index={i} onClick={() => toggle(i)} />
          ))}
        </div>
      ) : (
        <CameraBlock
          index={selectedCamera}
          fullscreen
          onClick={() => toggle(selectedCamera)}
        />
      )}
    </>
  );
};