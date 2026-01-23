import s from './VoltagePage.module.scss'
import { useSensorPolling } from "../../hooks/useSensorPolling"
import { useLevelStore } from '../../store/levelStore'
import { useVoltageStore } from '../../store/voltageStore'
import { useVoltagePoling } from '../../hooks/useVoltagePoling'
import { useVoltageEvents } from '../../hooks/useVoltageEvents'

export const VoltagePage = () => {

  useSensorPolling()
  useVoltagePoling()
  useVoltageEvents()

  const { sensor_0, sensor_1, sensor_2, sensor_3, sensor_4 } = useLevelStore()

  const { voltage_0, voltage_1, voltage_2, voltageStatuses } = useVoltageStore()
  

  return (
    <div className={s.pageContainer}>
      <header>
        <form action="/">
          <button className={s.redirection_button}>К видео-мониторингу</button>
        </form>
        <h1>Система мониторинга машины</h1>
      </header>

      <main>
        <div className={s.left_column}>
          <img src="/1.png" alt="Головная машина" />
          <h2>Головная машина</h2>
          <div className={`${s.voltage_card} ${s[voltageStatuses.voltage_0] || ''}`}>
            <div className={s.card_header}>
              <span className={s.voltage_label}>Напряжение на электродвигателе</span>
              <span className={s.voltage_base}>3.3</span>
            </div>
            <div className={s.voltage_value}>{voltage_0}<span className={s.unit}>V</span></div>
            <div className={s.status_indicator}></div>
          </div>
        </div>

        <div className={s.center_column}>
          <img src="/2.png" alt="Промежуточный вагон" />
          <h2>Промежуточный вагон</h2>
          <div className={`${s.voltage_card} ${s[voltageStatuses.voltage_1] || ''}`}>
            <div className={s.card_header}>
              <span className={s.voltage_label}>Напряжение на электродвигателе</span>
              <span className={s.voltage_base}>3.1</span>
            </div>
            <div className={s.voltage_value}>{voltage_1}<span className={s.unit}>V</span></div>
            <div className={s.status_indicator}></div>
          </div>

          <div className={s.container_sensors}>
            <div className={s.column_sensors}>
              <div className={s.load_card}>
                <div className={s.load_card_header}>
                  <span className={s.load_title}>Датчик 1</span>
                </div>
                <div className={s.load_value}>{sensor_0}<span className={s.load_unit}> мм</span></div>
              </div>
              <div className={s.load_card}>
                <div className={s.load_card_header}>
                  <span className={s.load_title}>Датчик 2</span>
                </div>
                <div className={s.load_value}>{sensor_1}<span className={s.load_unit}> мм</span></div>
              </div>
              <div className={s.load_card}>
                <div className={s.load_card_header}>
                  <span className={s.load_title}>Датчик 3</span>
                </div>
                <div className={s.load_value}>{sensor_2}<span className={s.load_unit}> мм</span></div>
              </div>
            </div>

            <div className={s.second_column_sensor}>
              <div className={s.load_card}>
                <div className={s.load_card_header}>
                  <span className={s.load_title}>Датчик 4</span>
                </div>
                <div className={s.load_value}>{sensor_3}<span className={s.load_unit}> мм</span></div>
              </div>
            </div>

            <div className={s.third_column_sensor}>
              <div className={`${s.load_card} ${s.container_one_card}`}>
                <div className={s.load_card_header}>
                  <span className={s.load_title}>Общая загрузка </span>
                </div>
                <div className={s.load_value}>{}<span className={s.load_unit}>%</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className={s.right_column}>
          <img src="/3.png" alt="Концевой вагон" />
          <h2>Концевой вагон</h2>
          <div className={`${s.voltage_card} ${s[voltageStatuses.voltage_2] || ''}`}>
            <div className={s.card_header}>
              <span className={s.voltage_label}>Напряжение на электродвигателе</span>
              <span className={s.voltage_base}>3.2</span>
            </div>
            <div className={s.voltage_value}>{voltage_2}<span className={s.unit}>V</span></div>
            <div className={s.status_indicator}></div>
          </div>

          <div className={s.row_sensor_columns}>
            <div className={s.load_card}>
              <div className={s.load_card_header}>
                <span className={s.load_title}>Датчик 5</span>
              </div>
              <div className={s.load_value}>{sensor_4}<span className={s.load_unit}> мм</span></div>
            </div>
            <div className={`${s.load_card} ${s.container_one_card}`}>
              <div className={s.load_card_header}>
                <span className={s.load_title}>Общая загрузка </span>
              </div>
              <div className={s.load_value}>20<span className={s.load_unit}>%</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};