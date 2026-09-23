import classNames from 'classnames'
import s from './VoltagePage.module.scss'
import { useSensorPolling } from "../../hooks/useSensorPolling"
import { useLevelStore } from '../../store/levelStore'
import { useVoltageStore } from '../../store/voltageStore'
import { VoltageChart } from './components/VoltageChart'
import { useVoltagePoling } from '../../hooks/useVoltagePoling'

// Состояние карточки ЗАГРУЗКИ вагона (loadValue, %):
//   0–50%   → красный (недогруз)
//   50–99%  → жёлтый  (в процессе заполнения)
//   100%    → зелёный (заполнен идеально)
//   >100%   → красный (перегруз)
const getLoadClass = (load: number): string => {
  const v = Math.round(load)
  if (v > 100) return s.stateDanger
  if (v === 100) return s.stateOk
  if (v >= 50) return s.stateWarning
  return s.stateDanger
}

// Нулевые отметки датчиков (мм). sensor_4 — головной вагон, у него своя метка.
const SENSOR_NORMS: Record<string, number> = {
  sensor_0: 50,
  sensor_1: 50,
  sensor_2: 50,
  sensor_3: 50,
  sensor_4: 78,
}

// Состояние ДАТЧИКА уровня — отклонение В МЕНЬШУЮ сторону от нулевой метки:
//   >15 мм → красный, >7 мм → жёлтый, иначе норма (синий).
// В большую сторону отклонения не считаем.
const getSensorClass = (sensorKey: string, mm: number): string => {
  const dev = SENSOR_NORMS[sensorKey] - mm
  if (dev > 15) return s.stateDanger
  if (dev > 7) return s.stateWarning
  return s.stateNormal
}

// Состояние НАПРЯЖЕНИЯ — по voltageStatuses из стора (SSE-события).
// edge — окантовка всей карточки: жёлтая при warning, красная при critical.
type VoltageStatus = 'normal' | 'warning' | 'critical'
const getVoltageState = (status: VoltageStatus = 'normal'): { cls: string; color: string; edge: string } => {
  if (status === 'critical') return { cls: s.stateDanger, color: 'var(--state-danger)', edge: s.edgeDanger }
  if (status === 'warning') return { cls: s.stateWarning, color: 'var(--state-warning)', edge: s.edgeWarning }
  return { cls: s.stateNormal, color: 'var(--accent)', edge: '' }
}

export const VoltagePage = () => {

  useSensorPolling()
  useVoltagePoling()

  const { sensor_0, sensor_1, sensor_2, sensor_3, sensor_4, load_vagon_1, load_vagon_2, load_vagon_3 } = useLevelStore()

  const { voltage_0, voltage_1, voltage_2, voltageStatuses, nominal, tolerance, voltageHistory } = useVoltageStore()

  // Подпись номинала формируется из значений, пришедших с бэка → всегда им соответствует.
  const nominalLabel = `НОМ ${nominal.toFixed(2)} ±${tolerance}`

  const v0 = getVoltageState(voltageStatuses.voltage_0 as VoltageStatus)
  const v1 = getVoltageState(voltageStatuses.voltage_1 as VoltageStatus)
  const v2 = getVoltageState(voltageStatuses.voltage_2 as VoltageStatus)


  return (
    <div className={s.pageContainer}>
      <div className={s.vagonsContainer}>
          <div className={s.vagon}>
              <div className={s.head}>[ ГОЛОВНАЯ МАШИНА ]</div>
              <div className={s.imageWrapper}>
                  <img src='./1.svg' alt='Головная машина' />
                  <div className={classNames(s.badge, getLoadClass(load_vagon_1))} style={{ top: '13%', left: '58%' }}>
                      <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                      <span className={s.badgeValue}>{load_vagon_1}%</span>
                  </div>
                  <div className={classNames(s.badge, v0.cls)} style={{ top: '72%', left: '55%' }}>
                      <span className={s.badgeLabel}>U</span>
                      <span className={s.badgeValue}>{voltage_0} V</span>
                  </div>
              </div>
          </div>

          <div className={s.vagon}>
              <div className={s.head}>[ ПРОМЕЖУТОЧНЫЙ ВАГОН ]</div>
              <div className={s.imageWrapper}>
                  <img src='./2.svg' alt='Промежуточный вагон' />
                  <div className={classNames(s.badge, getLoadClass(load_vagon_2))} style={{ top: '18%', left: '50%' }}>
                      <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                      <span className={s.badgeValue}>{load_vagon_2}%</span>
                  </div>
                  <div className={classNames(s.badge, v1.cls)} style={{ top: '68%', left: '50%' }}>
                    <span className={s.badgeLabel}>U</span>
                    <span className={s.badgeValue}>{voltage_1} V</span>
                  </div>
              </div>
          </div>

          <div className={s.vagon}>
              <div className={s.head}>[ КОНЦЕВОЙ ВАГОН ]</div>
              <div className={s.imageWrapper}>
                  <img src='./3.svg' alt='Концевой вагон' />
                  <div className={classNames(s.badge, getLoadClass(load_vagon_3))} style={{ top: '13%', left: '49%' }}>
                    <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                    <span className={s.badgeValue}>{load_vagon_3}%</span>
                  </div>
                  <div className={classNames(s.badge, v2.cls)} style={{ top: '75%', left: '50%' }}>
                    <span className={s.badgeLabel}>U</span>
                    <span className={s.badgeValue}>{voltage_2} V</span>
                  </div>
              </div>
          </div>
      </div>

        <div className={s.cardsContainer}>

            <div className={classNames(s.card, v0.edge)}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 1</div>
                  <div className={s.name}>Головная машина</div>
               </div>
               <div className={classNames(s.chartContainer, v0.cls)}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_0}<span> V</span></div>
                      <div className={s.nominal}>{nominalLabel}</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={voltageHistory.voltage_0} color={v0.color} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>1 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={classNames(s.levelCard, getSensorClass('sensor_4', sensor_4))}>
                    <div className={s.numberSensor}>Датчик 1</div>
                    <span className={s.mm}><span className={s.number}>{sensor_4}</span> мм</span>
                </div>

                <div className={classNames(s.loadCard, getLoadClass(load_vagon_1))}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_1}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${Math.min(load_vagon_1, 100)}%` }}></div>
                      </div>
                </div>

              </div>

            </div>


            <div className={classNames(s.card, v1.edge)}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 2</div>
                  <div className={s.name}>Промежуточный вагон</div>
               </div>
               <div className={classNames(s.chartContainer, v1.cls)}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_1}<span> V</span></div>
                      <div className={s.nominal}>{nominalLabel}</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={voltageHistory.voltage_1} color={v1.color} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>2 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={classNames(s.levelCard, getSensorClass('sensor_0', sensor_0))}>
                    <div className={s.numberSensor}>Датчик 2</div>
                    <span className={s.mm}><span className={s.number}>{sensor_0}</span> мм</span>
                </div>

                <div className={classNames(s.levelCard, getSensorClass('sensor_2', sensor_2))}>
                    <div className={s.numberSensor}>Датчик 3</div>
                    <span className={s.mm}><span className={s.number}>{sensor_2}</span> мм</span>
                </div>

                <div className={classNames(s.loadCard, getLoadClass(load_vagon_2))}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_2}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${Math.min(load_vagon_2, 100)}%` }}></div>
                      </div>
                </div>

              </div>

            </div>


            <div className={classNames(s.card, v2.edge)}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 3</div>
                  <div className={s.name}>Концевой вагон</div>
               </div>
               <div className={classNames(s.chartContainer, v2.cls)}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_2}<span> V</span></div>
                      <div className={s.nominal}>{nominalLabel}</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={voltageHistory.voltage_2} color={v2.color} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>2 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={classNames(s.levelCard, getSensorClass('sensor_1', sensor_1))}>
                    <div className={s.numberSensor}>Датчик 4</div>
                    <span className={s.mm}><span className={s.number}>{sensor_1}</span> мм</span>
                </div>

                <div className={classNames(s.levelCard, getSensorClass('sensor_3', sensor_3))}>
                    <div className={s.numberSensor}>Датчик 5</div>
                    <span className={s.mm}><span className={s.number}>{sensor_3}</span> мм</span>
                </div>

                <div className={classNames(s.loadCard, getLoadClass(load_vagon_3))}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_3}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${Math.min(load_vagon_3, 100)}%` }}></div>
                      </div>
                </div>

              </div>

            </div>

        </div>
        
    </div>
  );
};