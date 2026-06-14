import { useLocation, useNavigate } from "react-router"
import s from "./header.module.scss"
import { IconArrowLeft, IconMenu2, IconVideo } from "@tabler/icons-react"
import classNames from "classnames"
import { useVoltageStore } from "../../store/voltageStore"
import { useState, useEffect } from "react"
import { useLevelStore } from "../../store/levelStore"

export const Header = () => {

    let location = useLocation()
    const navigate = useNavigate()

    const { load_all } = useLevelStore()

    const [shiftStart] = useState(() => new Date())
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const { voltage_warning_count } = useVoltageStore()

    const formatDuration = (ms: number) => {
        const total = Math.max(0, Math.floor(ms / 1000))
        const h = Math.floor(total / 3600)
        const m = Math.floor((total % 3600) / 60)
        const s = total % 60
        return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
    }

    return (
        <>
        <div className={s.container}>
            <div className={s.buttonsGroup}>
                <button className={s.button} onClick={
                    location.pathname == '/voltage' ? () => navigate('/'): () => navigate('/voltage')
                }>
                    <IconArrowLeft size={18} color={'white'} stroke={2}/>
                        {location.pathname == '/voltage' ? 'К ВИДЕО-МОНИТОРИНГУ' : 'К МОНИТОРИНГУ МАШИНЫ'}
                </button>
            </div>
            <div className={s.currentPage}>
                <div className={classNames(s.common, { [s.active]: location.pathname === '/' })}>
                    <IconVideo size={18} className={s.icon} stroke={2}/>
                    ВИДЕО-МОНИТОРИНГ
                </div>
                <div className={classNames(s.common, { [s.active]: location.pathname === '/voltage' })}>
                    <IconMenu2 size={18} className={s.icon} stroke={2}/>
                    МОНИТОРИНГ МАШИНЫ
                </div>
            </div>
            <div className={s.loadingInfo}>
                <div className={s.load}>
                    ДО ЗАПОЛНЕНИЯ
                    <div className={s.row}>
                        <span className={s.time}>12  </span>
                        <span className={s.minute}>МИН</span>
                    </div>
                </div>
                <div className={s.status}>
                    <div className={s.circle}></div>
                    В СЕТИ
                </div>
                <div className={s.alarms}>
                    <div className={classNames(s.circle, { [s.alarmActive]: voltage_warning_count > 0 })} />
                        ТРЕВОГ: {voltage_warning_count}
                </div>
                <div className={s.time}>
                    {time.toLocaleTimeString('ru-RU')}
                </div>
            </div>
        </div>
        <div className={s.subheaderContainer}>
            {location.pathname === '/voltage' ? 
            <>
                <div className={s.info}>
                    [МОНИТОРИНГ МАШИНЫ · СОСТАВ]
                    <span>3 ВАГОНА · 5 ДАТЧИКОВ</span>
                </div>

                    <div className={s.stats}>
                        <div className={s.statItem}>
                            <div className={s.statLabel}>ОБЩАЯ ЗАГРУЗКА</div>
                            <div className={s.statValue}>{load_all}%</div>
                            <div className={s.progressBar}>
                            <div className={s.progressFill} style={{ width: `${load_all}` }}></div>
                            </div>
                        </div>

                        <div className={s.statItem}>
                            <div className={s.statLabel}>ВРЕМЯ СМЕНЫ</div>
                            <div className={s.statValueAccent}>{formatDuration(time.getTime() - shiftStart.getTime())}</div>
                        </div>

                        <div className={s.statItem}>
                            <div className={s.statLabel}>ОПЕРАТОР</div>
                            <div className={s.statValue}>К. ЕРОХИНА</div>
                        </div>
                </div>
            </>
            : 
            <>
                <div className={s.info}>
                    [ВИДЕО-МОНИТОРИНГ · 4 КАНАЛА]
                    <span>SYNC · LIVE · 30 FPS</span>
                </div>
                <div className={s.groupButtons}>
                    <div className={s.two}>
                        2x2
                    </div>
                </div>
            </>
            
            }
        </div>
        </>
    )
}