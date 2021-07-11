import { useEffect, useRef, useState } from 'react';
import SquareCell from '../SquareCell/SquareCell';
import { imageWavified } from '../type';
import { WavePhase } from '../Wave/type';
import Wave from '../Wave/Wave';

interface Props {
    imageConfig: imageWavified;
    intensity: number
}

export default function WavifiedImage({imageConfig, intensity}: Props) {
    const inited = useRef(0);
    const [phase, setPhase] = useState(WavePhase.DISPLAYED);
    const newImage = useRef(imageConfig)

    useEffect(() => {
        const tmp = inited.current;
        if (tmp !== 0) {
            setPhase(WavePhase.WHITE_LINE);
        }
        const timer2 = setTimeout(() => {
            if (tmp !== 0) {
                setPhase(WavePhase.WHITE_LINE_PREPARATION);
                newImage.current = imageConfig;
            }
            clearTimeout(timer2);
        }, 1000);
        const timer3 = setTimeout(() => {
            if (tmp !== 0) {
                setPhase(WavePhase.DISPLAYED);
            }
            clearTimeout(timer3);
        }, 1600);
        if (tmp === 0) {
            inited.current = imageConfig.id;
            newImage.current = imageConfig;
        }
        return () => {
            clearTimeout(timer2);
            clearTimeout(timer3);
        }
    }, [imageConfig]);

    return <>{
        newImage.current.listWave.map((waveConfig, index) => {
            const nbPeriod = Math.round((waveConfig.grey - imageConfig.darkest) / (imageConfig.brightest - imageConfig.darkest) * 4);

            return <SquareCell x={waveConfig.x} y={waveConfig.y} key={'square'+index}>
                <Wave waveConfig={{
                    nbPeriod: nbPeriod === 0 ? 1 : nbPeriod,
                    intensity: nbPeriod === 0 ? 0 : intensity,
                    color: waveConfig.color,
                    phase: phase
                }} key={'wave'+waveConfig.x+'/'+waveConfig.y}/>
            </SquareCell>
        })
    }</>;
}