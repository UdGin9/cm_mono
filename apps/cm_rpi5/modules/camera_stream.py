import cv2
from flask import Response

ROTATE_CODES = {
    90: cv2.ROTATE_90_CLOCKWISE,
    180: cv2.ROTATE_180,
    270: cv2.ROTATE_90_COUNTERCLOCKWISE,
}

class CameraStream:
    def __init__(self, camera_ids, rotations=None):
        # Повороты приводим к позициям в self.cams: generate_feed получает индекс, а не физический id.
        self.rotations = [ROTATE_CODES.get((rotations or {}).get(cam_id, 0)) for cam_id in camera_ids]
        self.cams = []
        for cam_id in camera_ids:
            cap = cv2.VideoCapture(cam_id)
            if not cap.isOpened():
                raise RuntimeError(f"Не удалось открыть камеру {cam_id}")
            
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            cap.set(cv2.CAP_PROP_FPS, 30)

            self.cams.append(cap)

    def generate_feed(self, camera_index):
        """Генератор кадров для MJPEG"""
        rotate_code = self.rotations[camera_index]
        while True:
            success, frame = self.cams[camera_index].read()
            if not success:
                break
            if rotate_code is not None:
                frame = cv2.rotate(frame, rotate_code)
            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    def get_camera_count(self):
        return len(self.cams)

    def release(self):
        for cap in self.cams:
            cap.release()