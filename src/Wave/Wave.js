import { useEffect, useState } from 'react';
import styles from './Wave.module.css';

function Wave({nbPeriod, intensity, color}) {
    /** To compute the path by giving the number of period and its intensity */
    const computePath = (nbPeriodForPath, intensityForPath) => {
        let res = 'M 0 50';
        for (let i = 1; i <= nbPeriodForPath; i++) {
            const point = (100 / nbPeriodForPath) * i
            const previousPoint = (100 / nbPeriodForPath) * (i - 1)
            const halfway = ((point - previousPoint) / 2) + previousPoint;

            const intensityValue = (intensityForPath / 100) * 170;
            const low = 50 - intensityValue; // min -120
            const hight = 50 + intensityValue; // max 220
            res += ` C ${halfway} ${low} ${halfway} ${hight} ${point} 50`;
        }
        return res;
    }

    /** The svg path of the wave */
    const [path, setPath] = useState(computePath(nbPeriod, intensity));

    /** The currently displayed color */
    const [displayedColor, setDisplayedColor] = useState(color);

    /** The saved number of wave's period */
    const [nbPeriodSaved, setNbPeriodSaved] = useState(nbPeriod);

    /** To be able to make a transition between the current wave and the new wave to display (after 2s) */
    const goToWhiteLine = () => {
        setPath(computePath(nbPeriodSaved, 1));
        setDisplayedColor('#cccccc');

        const timer = setTimeout(() => {
            setPath(computePath(nbPeriodSaved, 1));
            goToNewPath();
            clearTimeout(timer);
        }, 2000);
    }

    /** To display a new wave */
    const goToNewPath = () => {
        setPath(computePath(nbPeriodSaved, intensity));
        setDisplayedColor(color);
    }

    /** Each time the nbPeriod, intensity or color of the wave should change we need a transition to a white line */
    useEffect(() => {
        const timer = setTimeout(() => {
            goToWhiteLine();
            clearTimeout(timer);
        }, 500);
    }, [nbPeriod, intensity, color]);

    /** When a new path is computed we need to save the number of periode so we can make smooth transition */
    useEffect(() => {
        setNbPeriodSaved(nbPeriod);
    }, [path])

    return (
        <div className={styles.cell}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-1 -1 101 101`}>
                <path style={{"--path": `'${path}'`, "--color": displayedColor}} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
            </svg>
        </div>
      );
}

export default Wave;
