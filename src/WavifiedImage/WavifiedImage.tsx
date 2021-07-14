import { useEffect, useRef, useState } from 'react';
import SquareCell from '../SquareCell/SquareCell';
import { ImageWavified } from '../type';
import useTick from '../useTick/useTick';
import { WavePhase } from '../Wave/type';
import Wave from '../Wave/Wave';

interface Props {
    imageConfig: ImageWavified;
    intensity: number;
    width: number;
    height: number;
}

export default function WavifiedImage({imageConfig, intensity, width}: Props) {
    const [progress, setProgress] = useState(-10);
    const imagePhase = useRef(imageConfig.listWave.map(() => WavePhase.DISPLAYED));

    const [image, setImage] = useState(imageConfig)

    useTick(() => {
        if (progress <= 100) {
            imagePhase.current = image.listWave.map((elt, index) => {
                const position = (elt.x / width * 100);
                if (elt.y % 2 === 0) {
                    if (position <= progress) {
                        return WavePhase.DISPLAYED;
                    } else if (position <= progress + 1) {
                        return WavePhase.WHITE_LINE_PREPARATION;
                    } else if (position <= progress + 10) {
                        return WavePhase.WHITE_LINE;
                    }
                } else {
                    if (position >= 100 - progress) {
                        return WavePhase.DISPLAYED;
                    } else if (position >= 100 - (progress + 1)) {
                        return WavePhase.WHITE_LINE_PREPARATION;
                    } else if (position >= 100 - (progress + 10)) {
                        return WavePhase.WHITE_LINE;
                    }
                }

                return imagePhase.current[index];
            });
            setProgress(progress + 1);
        }
    }, 50);

    useEffect(() => {
        setImage(image);
    }, [progress]);

    useEffect(() => {
        setProgress(-10);
        setImage(imageConfig);
    }, [imageConfig]);

    return <>{
        image.listWave.map((waveConfig, index) => {
            const nbPeriod = Math.round((waveConfig.grey - imageConfig.darkest) / (imageConfig.brightest - imageConfig.darkest) * 4);

            return <SquareCell x={waveConfig.x} y={waveConfig.y} key={'square'+index}>
                <Wave waveConfig={{
                    nbPeriod: nbPeriod === 0 ? 1 : nbPeriod,
                    intensity: nbPeriod === 0 ? 0 : intensity,
                    color: waveConfig.color,
                    phase: imagePhase.current[index]
                }} key={'wave'+index}/>
            </SquareCell>
        })
    }</>;
}