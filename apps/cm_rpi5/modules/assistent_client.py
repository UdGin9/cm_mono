import requests
import logging

logger = logging.getLogger(__name__)

class AssistantClient:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
    
    def get_sensor_data(self):
        try:
            resp = requests.get(f"{self.base_url}/get_sensor_data", timeout=3)
            return resp.json() if resp.status_code == 200 else {}
        except Exception as e:
            logger.error(f"Ошибка получения датчиков с Pi 3: {e}")
            return {}