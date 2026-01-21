import React, { useState } from "react";
import { useNavigate } from "react-router";
import s from './HomePage.module.scss';

const CAMERA_COUNT = 4;
const BASE_URL_PI5 = import.meta.env.VITE_BASE_RASPBERRY_5_URL; // cam0, cam1
const BASE_URL_PI3 = import.meta.env.VITE_BASE_RASPBERRY_3_URL; // cam2 → cam0, cam3 → cam1

const getCameraUrl = (cameraIndex: number): string => {
  if (cameraIndex === 0 || cameraIndex === 1) {
    return `${BASE_URL_PI5}/cam${cameraIndex}`;
  } else if (cameraIndex === 2 || cameraIndex === 3) {
    const remoteCamIndex = cameraIndex - 2;
    return `${BASE_URL_PI3}/cam${remoteCamIndex}`;
  }
  throw new Error(`Неподдерживаемый индекс камеры: ${cameraIndex}`);
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);

  const handleCameraClick = (index: number) => {
    if (selectedCamera === index) {
      setSelectedCamera(null);
    } else {
      setSelectedCamera(index);
    }
  };

  return (
    <>
      <header>
        <button className={s.redirection_button} onClick={() => navigate('/voltage')}>
          К мониторингу напряжения
        </button>
        <h1>Система видео-мониторинга - CM2</h1>
        <div className={s.prediction_container}>
          <h2>До заполнения: <span id="time-left"> — </span> минут</h2>
        </div>
      </header>

      {selectedCamera === null ? (
        <div className={s.camera_grid}>
          {Array.from({ length: CAMERA_COUNT }).map((_, i) => (
            <div key={i} className={s.camera_container} onClick={() => handleCameraClick(i)}>
              <span className={s.camera_label}>Камера {i + 1}</span>
              <img
                src={getCameraUrl(i)}
                className={s.camera_feed}
                alt={`Камера ${i + 1}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={s.fullscreen_camera} onClick={() => handleCameraClick(selectedCamera)}>
          <span className={s.camera_label}>Камера {selectedCamera + 1}</span>
          <img
            src={getCameraUrl(selectedCamera)}
            alt={`Камера ${selectedCamera + 1}`}
            className={s.camera_feed_full}
          />
        </div>
      )}
    </>
  );
};