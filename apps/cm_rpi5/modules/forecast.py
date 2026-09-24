import math
import time
from collections import deque

from config import FORECAST_MAX_ETA_SEC, FORECAST_MIN_SAMPLES, FORECAST_STALE_SEC


class LoadForecast:
    def __init__(self, max_samples=40):
        self.samples = deque(maxlen=max_samples)

    def update(self, load_all):
        self.samples.append((time.time(), load_all))

    def eta_minutes(self):
        if len(self.samples) < FORECAST_MIN_SAMPLES:
            return None
        if self.samples[-1][1] >= 100:
            return 0
        if time.time() - self.samples[-1][0] > FORECAST_STALE_SEC:
            return None

        slope = self._slope()
        if slope is None or slope <= 0:
            return None

        eta_sec = (100 - self.samples[-1][1]) / slope
        if eta_sec > FORECAST_MAX_ETA_SEC:
            return None
        return math.ceil(eta_sec / 60)

    def _slope(self):
        n = len(self.samples)
        mean_t = sum(t for t, _ in self.samples) / n
        mean_l = sum(l for _, l in self.samples) / n
        num = sum((t - mean_t) * (l - mean_l) for t, l in self.samples)
        den = sum((t - mean_t) ** 2 for t, _ in self.samples)
        if den == 0:
            return None
        return num / den
