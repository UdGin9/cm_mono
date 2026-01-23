# cm_mono
Монорепозиторий по проекту макета снеугоборочный машины в рамках студенческого стартапа

# cm_client
Краткая инструкция по установке 
1. Перейти в папку /apps/cm_client
2. Выполнить `npm i`
3. Создать .env файл с содержанием: `VITE_BASE_RASPBERRY_5_URL=http://198.18.0.1:15555 VITE_BASE_RASPBERRY_3_URL=http://192.168.31.143:15555`. Возможно, иногда потребуется заменить IP-расберри.
4. Запустить проект: `npm run tauri dev` (в режиме разработки).


# cm_rpi3-5
Краткая инструкция по установке
1. Установить образ Raspberry OS Lite на флешку.
2. `sudo apt install git`
3. `sudo apt update`
4. `curl -LsSf https://astral.sh/uv/install.sh | sh`
5. `sudo apt install -y libgl1 libglib2.0-0 libsm6 libxrender1 libxext6`
6. git clone
7. uv run main.py