import s from './VoltagePage.module.scss'
import { useSensorPolling } from "../../hooks/useSensorPolling"
import { useLevelStore } from '../../store/levelStore'
import { useVoltageStore } from '../../store/voltageStore'
import { useVoltagePoling } from '../../hooks/useVoltagePoling'
import { useVoltageEvents } from '../../hooks/useVoltageEvents'
import { VoltageChart } from './components/VoltageChart'

export const VoltagePage = () => {
  
  useSensorPolling()
  useVoltagePoling()
  useVoltageEvents()

  const { sensor_0, sensor_1, sensor_2, sensor_3, sensor_4, load_vagon_1, load_vagon_2, load_vagon_3 } = useLevelStore()

  const { voltage_0, voltage_1, voltage_2, voltageStatuses } = useVoltageStore()
  

  return (
    <div className={s.pageContainer}>
      <div className={s.vagonsContainer}>
          <div className={s.vagon}>
              <div className={s.head}>[ ГОЛОВНАЯ МАШИНА ]</div>
              <div className={s.imageWrapper}>
                  <img src='./1.svg' alt='Головная машина' />
                  <div className={s.badge} style={{ top: '13%', left: '58%' }}>
                      <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                      <span className={s.badgeValue}>{load_vagon_1}%</span>
                  </div>
                  <div className={s.badge} style={{ top: '72%', left: '55%' }}>
                      <span className={s.badgeLabel}>U</span>
                      <span className={s.badgeValue}>{voltage_0} V</span>
                  </div>
              </div>
          </div>

          <div className={s.vagon}>
              <div className={s.head}>[ ПРОМЕЖУТОЧНЫЙ ВАГОН ]</div>
              <div className={s.imageWrapper}>
                  <img src='./2.svg' alt='Промежуточный вагон' />
                  <div className={s.badge} style={{ top: '18%', left: '50%' }}>
                      <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                      <span className={s.badgeValue}>{load_vagon_2}%</span>
                  </div>
                  <div className={s.badge} style={{ top: '68%', left: '50%' }}>
                    <span className={s.badgeLabel}>U</span>
                    <span className={s.badgeValue}>{voltage_1} V</span>
                  </div>
              </div>
          </div>

          <div className={s.vagon}>
              <div className={s.head}>[ КОНЦЕВОЙ ВАГОН ]</div>
              <div className={s.imageWrapper}>
                  <img src='./3.svg' alt='Концевой вагон' />
                  <div className={s.badge} style={{ top: '13%', left: '49%' }}>
                    <span className={s.badgeLabel}>ЗАГРУЗКА</span>
                    <span className={s.badgeValue}>{load_vagon_3}%</span>
                  </div>
                  <div className={s.badge} style={{ top: '75%', left: '50%' }}>
                    <span className={s.badgeLabel}>U</span>
                    <span className={s.badgeValue}>{voltage_2} V</span>
                  </div>
              </div>
          </div>
      </div>

        <div className={s.cardsContainer}>

            <div className={s.card}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 1</div>
                  <div className={s.name}>Головная машина</div>
               </div>
               <div className={s.chartContainer}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_0}<span> V</span></div>
                      <div className={s.nominal}>НОМ 3.30 ±0.5</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={[0,1,2,3,1,2,3,4,5,11,4]} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>2 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={s.levelCard}>
                    <div className={s.numberSensor}>Датчик 1</div>
                    <span className={s.mm}><span className={s.number}>{sensor_0}</span> мм</span>
                </div>

                <div className={s.levelCard}>
                    <div className={s.numberSensor}>Датчик 2</div>
                    <span className={s.mm}><span className={s.number}>{sensor_1}</span> мм</span>
                </div>

                <div className={s.loadCard}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_1}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${load_vagon_1}` }}></div>
                      </div>
                </div>

              </div>

            </div>


            <div className={s.card}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 2</div>
                  <div className={s.name}>Промежуточный вагон</div>
               </div>
               <div className={s.chartContainer}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_1}<span> V</span></div>
                      <div className={s.nominal}>НОМ 3.30 ±0.5</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={[0,1,2,3,1,2,3,4,5,11,4]} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>2 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={s.levelCard}>
                    <div className={s.numberSensor}>Датчик 3</div>
                    <span className={s.mm}><span className={s.number}>{sensor_2}</span> мм</span>
                </div>

                <div className={s.levelCard}>
                    <div className={s.numberSensor}>Датчик 4</div>
                    <span className={s.mm}><span className={s.number}>{sensor_3}</span> мм</span>
                </div>

                <div className={s.loadCard}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_2}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${load_vagon_2}` }}></div>
                      </div>
                </div>

              </div>

            </div>


            <div className={s.card}>
               <div className={s.head}>
                  <div className={s.modul}>МОДУЛЬ 3</div>
                  <div className={s.name}>Концевой вагон</div>
               </div>
               <div className={s.chartContainer}>
                  <div className={s.text}>Напряжение на двигателе</div>
                  <div className={s.info}>
                      <div className={s.voltage}>{voltage_2}<span> V</span></div>
                      <div className={s.nominal}>НОМ 3.30 ±0.5</div>
                  </div>
                  <div className={s.chart}>
                     <VoltageChart data={[0,1,2,3,1,2,3,4,5,11,4]} />
                  </div>
              </div>


              <div className={s.loadWrapper}>
                <div className={s.headContainer}>
                  <div className={s.head}>ДАТЧИКИ ЗАГРУЗКИ</div>
                  <div className={s.head}>1 шт</div>
                </div>
              </div>
              
              <div className={s.levelCards}>

                <div className={s.levelCard}>
                    <div className={s.numberSensor}>Датчик 5</div>
                    <span className={s.mm}><span className={s.number}>{sensor_4}</span> мм</span>
                </div>

                <div className={s.loadCard}>
                    <div className={s.numberSensor}>Загрузка вагона</div>
                    <span className={s.mm}><span className={s.number}>{load_vagon_3}</span> %</span>
                      <div className={s.progressBar}>
                        <div className={s.progressFill} style={{ width: `${load_vagon_3}` }}></div>
                      </div>
                </div>

              </div>

            </div>

        </div>
        
    </div>
  );
};