import { useEffect } from 'react';
import styles from './Wave.module.css';

function Wave({nbPeriod, intensity, color}) {
    const computePath = () => {
        let res = 'M 0 50';
        for (let i = 1; i <= nbPeriod; i++) {
            const point = (100 / nbPeriod) * i
            const previousPoint = (100 / nbPeriod) * (i - 1)
            const halfway = ((point - previousPoint) / 2) + previousPoint;

            const intensityValue = (intensity / 100) * 170;
            const low = 50 - intensityValue; // min -120
            const hight = 50 + intensityValue; // max 220
            res += ` C ${halfway} ${low} ${halfway} ${hight} ${point} 50`;
        }
        return res;
    }

    let path = computePath();

    useEffect(() => {
        path = computePath();
    }, [nbPeriod, intensity, color]);

    return (
        <div className={styles.cell}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-1 -1 101 101`}>
                <path style={{"--path": `'${path}'`, "--color": color}} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
            </svg>
        </div>
      );
}

export default Wave;
