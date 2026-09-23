from flask import Flask, jsonify, Response
from flask_cors import CORS, cross_origin
from collections import deque
import logging
import time, json

from config import (
    LOCAL_CAMERA_IDS, CAMERA_ROTATIONS, LOCAL_SENSOR_PORTS, ASSISTANT_SERVER_URL, FLASK_PORT,
    VOLTAGE_NOMINAL, VOLTAGE_WARN_DELTA, VOLTAGE_CRIT_DELTA,
)
from modules.camera_stream import CameraStream
from modules.sensor_reader import SensorReader
from modules.assistent_client import AssistantClient
from modules.voltage_stream import VoltageStream

logging.basicConfig(level=logging.INFO)

logging.getLogger('werkzeug').setLevel(logging.WARNING)

app = Flask(__name__)
CORS(app)

# Подсчёт загрузки вагонов: среднее последних 3 замеров датчика,
# отклонение от нулевой метки; −20 мм = 100% загрузки.
SENSOR_NORMS = {'sensor_0': 50, 'sensor_1': 50, 'sensor_4': 78}
LOAD_FULL_DEV_MM = 40
LOAD_WAGON_WEIGHTS = (0.10, 0.50, 0.40)  # вагон 1 (головной), 2 (промежуточный), 3 (концевой)

sensor_history = {key: deque(maxlen=3) for key in SENSOR_NORMS}

def calc_load(sensor_key: str) -> int:
    values = sensor_history[sensor_key]
    if not values:
        return 0
    avg = sum(values) / len(values)
    load = (SENSOR_NORMS[sensor_key] - avg) / LOAD_FULL_DEV_MM * 100
    return round(max(0, load))

local_cameras = CameraStream(LOCAL_CAMERA_IDS, CAMERA_ROTATIONS)

local_sensors = []
for port in LOCAL_SENSOR_PORTS:
    sr = SensorReader(
        port=port,
        baudrate=9600,
        timeout=1,
        modbus_command=bytes([0x01, 0x03, 0x01, 0x00, 0x00, 0x01, 0x85, 0xF6]),
        update_interval=3,
        use_mock=False
    )
    sr.start()
    local_sensors.append(sr)

remote_client = AssistantClient(ASSISTANT_SERVER_URL)
voltage_stream = VoltageStream(
    sensor_count=3,
    update_interval_sec=15.0,
    nominal=VOLTAGE_NOMINAL,
    warn_delta=VOLTAGE_WARN_DELTA,
    crit_delta=VOLTAGE_CRIT_DELTA,
)

@app.route('/cam<int:cam_id>')
def unified_camera_feed(cam_id):
    if local_cameras and cam_id < local_cameras.get_camera_count():
        return Response(
            local_cameras.generate_feed(cam_id),
            mimetype='multipart/x-mixed-replace; boundary=frame'
        )
    else:
        return "Камера недоступна", 404

@app.route('/sensors')
def get_all_sensors():
    data = {}

    for i, sensor in enumerate(local_sensors):
        data[f"sensor_{i}"] = round(sensor.get_data(),1)
    data['sensor_2'] = round(local_sensors[0].get_fluctuated_data(),1)
    data['sensor_3'] = round(local_sensors[1].get_fluctuated_data(),1)

    remote_data = remote_client.get_sensor_data()

    data["sensor_4"] = round(remote_data.get("sensor_data_1", 0.0),1)

    for key in sensor_history:
        sensor_history[key].append(data[key])

    # Вагон 1 — головной (sensor_4), вагон 2 — промежуточный (sensor_0), вагон 3 — концевой (sensor_1).
    data['load_vagon_1'] = calc_load('sensor_4')
    data['load_vagon_2'] = calc_load('sensor_0')
    data['load_vagon_3'] = calc_load('sensor_1')
    data['load_all'] = round(
        data['load_vagon_1'] * LOAD_WAGON_WEIGHTS[0]
        + data['load_vagon_2'] * LOAD_WAGON_WEIGHTS[1]
        + data['load_vagon_3'] * LOAD_WAGON_WEIGHTS[2]
    )

    return jsonify(data)

@app.route('/voltage')
def get_voltage_levels():
    try:
        data = voltage_stream.get_latest_voltages()
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"Ошибка в /voltage: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
    
@app.route('/voltage/events')
@cross_origin(origins="*")
def voltage_events():
    def event_stream():
        last_sent = None
        while True:
            event = voltage_stream.get_latest_event()
            payload = {
                "voltages": voltage_stream.get_latest_voltages(),
                "event": event if event else {"type": "normal", "message": "Все значения в норме"},
                "nominal": VOLTAGE_NOMINAL,
                "tolerance": VOLTAGE_WARN_DELTA,
            }
            serialized = json.dumps(payload)
            if serialized != last_sent:
                last_sent = serialized
                yield f"data: {serialized}\n\n"
            time.sleep(1)

    return Response(event_stream(), mimetype='text/event-stream')


@app.route('/')
def index():
    links = "<h2>Основной сервер — RPi 5</h2>"
    for i in range(4):
        links += f'<br><a href="/cam{i}">Камера {i}</a>'
    links += '<br><br><a href="/sensors">Все датчики (JSON)</a>'
    links += '<br><br><a href="/voltage">Напряжение(JSON)</a>'
    return links

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=FLASK_PORT, debug=False, threaded=True)
    finally:
        if local_cameras:
            local_cameras.release()
        for s in local_sensors:
            s.stop()