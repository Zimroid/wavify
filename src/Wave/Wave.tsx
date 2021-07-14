import React, { useEffect, useRef, useState } from 'react';
import styles from './Wave.module.css';
import WaveConfig, { WavePhase } from './type';

interface Props {
    waveConfig: WaveConfig,
}

export default function Wave({waveConfig}: Props) {
    /** The currently displayed color */
    const [displayedColor, setDisplayedColor] = useState(waveConfig.color);

    /** The saved number of wave's period */
    const nbPeriodSaved = useRef(waveConfig.nbPeriod);

    const phase = useRef(WavePhase.DISPLAYED);

    /** To compute the path by giving the number of period and its intensity */
    const computePath = (nbPeriodForPath: number, intensityForPath: number) => {
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
    const [path, setPath] = useState(computePath(waveConfig.nbPeriod, waveConfig.intensity));

    /** To be able to make a transition between the current wave and the new wave to display */
    const goToWhiteLine = () => {
        setPath(computePath(nbPeriodSaved.current, 1));
        setDisplayedColor('#424242');
    }

    /** To display a new wave */
    const goToNewPath = () => {
        setPath(computePath(waveConfig.nbPeriod, waveConfig.intensity));
        setDisplayedColor(waveConfig.color);
    }

    const prepareNewPath = () => {
        setPath(computePath(waveConfig.nbPeriod, 1));
        nbPeriodSaved.current = waveConfig.nbPeriod
        setDisplayedColor('#424242');
    }

    useEffect(() => {
        phase.current = waveConfig.phase;
        switch (phase.current) {
            case WavePhase.WHITE_LINE:
                goToWhiteLine();
                break;
            case WavePhase.DISPLAYED:
                goToNewPath();
                break;
            default:
                prepareNewPath();
                break;
            }
    }, [waveConfig.phase])

    return (
        <div className={styles.cell}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`-1 -1 101 101`}>
                <path style={{"--path": `'${path}'`, "--color": displayedColor} as React.CSSProperties} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
            </svg>
        </div>
      );
}
