import random
import threading
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class VoltageEvent:
    voltage: str
    value: float
    event_type: str  # "warning", "critical"
    message: str

class VoltageStream:
    def __init__(self, sensor_count: int = 3, base_voltages: List[float] = None, update_interval_sec: float = 15.0):
        self.sensor_count = sensor_count
        if base_voltages is None:
            self.base_voltages = [3.3, 3.1, 3.2][:sensor_count]
        else:
            if len(base_voltages) != sensor_count:
                raise ValueError("Длина base_voltages должна совпадать с sensor_count")
            self.base_voltages = base_voltages

        self.update_interval_sec = update_interval_sec
        self._current_voltages: Dict[str, float] = {}
        self._last_event: Optional[VoltageEvent] = None
        self._lock = threading.Lock()
        self._stop_event = threading.Event()

        self._update_thread = threading.Thread(target=self._update_loop, daemon=True)
        self._update_thread.start()
        self._update_data()

    def _simulate_sensor_data(self) -> List[float]:
        return [
            round(max(0.0, min(4, base + random.uniform(-0.1, 0.4))), 2)
            for base in self.base_voltages
        ]

    def _check_for_events(self, voltages: List[float]) -> Optional[VoltageEvent]:
        for i, value in enumerate(voltages):
            voltage_name = f"voltage_{i}"
            if value > 3.6:
                return VoltageEvent(
                    voltage=voltage_name,
                    value=value,
                    event_type="critical",
                    message=f"Критически высокое напряжение на {voltage_name}!"
                )
            elif value > 3.5:
                return VoltageEvent(
                    voltage=voltage_name,
                    value=value,
                    event_type="warning",
                    message=f"Повышенное напряжение на {voltage_name}"
                )
        return None

    def _update_data(self):
        voltages = self._simulate_sensor_data()
        data = {f"voltage_{i}": voltages[i] for i in range(self.sensor_count)}
        event = self._check_for_events(voltages)

        with self._lock:
            self._current_voltages = data
            self._last_event = event

    def _update_loop(self):
        while not self._stop_event.is_set():
            self._update_data()
            self._stop_event.wait(timeout=self.update_interval_sec)

    def get_latest_voltages(self) -> Dict[str, float]:
        with self._lock:
            return self._current_voltages.copy()

    def get_latest_event(self) -> Optional[Dict]:
        with self._lock:
            if self._last_event:
                return {
                    "voltage": self._last_event.voltage,
                    "value": self._last_event.value,
                    "type": self._last_event.event_type,
                    "message": self._last_event.message
                }
            return None

    def stop(self):
        self._stop_event.set()
        self._update_thread.join(timeout=1)