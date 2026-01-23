from flask import Flask, jsonify, Response
from flask_cors import CORS, cross_origin
import logging
import time, json

from config import LOCAL_CAMERA_IDS, LOCAL_SENSOR_PORTS, ASSISTANT_SERVER_URL, FLASK_PORT
from modules.camera_stream import CameraStream
from modules.sensor_reader import SensorReader
from modules.assistent_client import AssistantClient
from modules.voltage_stream import VoltageStream

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

local_cameras = CameraStream(LOCAL_CAMERA_IDS)

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
voltage_stream = VoltageStream(sensor_count=3, update_interval_sec=15.0)

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

    remote_data = remote_client.get_sensor_data()

    data["sensor_3"] = round(remote_data.get("sensor_data_1", 0.0),1)
    data["sensor_4"] = round(remote_data.get("sensor_data_2", 0.0),1)

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
        last_sent_event = None
        while True:
            event = voltage_stream.get_latest_event()
            if event != last_sent_event:
                last_sent_event = event
                payload = json.dumps(event if event else {"type": "normal", "message": "Все значения в норме"})
                yield f"data: {payload}\n\n"
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