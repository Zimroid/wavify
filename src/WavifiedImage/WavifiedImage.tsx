import { MutableRefObject, useEffect, useRef, useState } from 'react';
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

export default function WavifiedImage({imageConfig, intensity, width, height}: Props) {
    const [progress, setProgress] = useState(-10);
    const imagePhase: MutableRefObject<WavePhase[]> = useRef([]);

    const [image, setImage] = useState(imageConfig);
    const firstDisplay = useRef(0);

    const biggestSide = width > height ? width : height;

    useTick(() => {
        if (progress <= 100 && firstDisplay.current > 2) {
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
            setProgress(progress + Math.round(biggestSide / width));
        }
    }, 50);

    useEffect(() => {
        setImage(prevImage => (prevImage));
    }, [progress]);

    useEffect(() => {
        setProgress(-10);
        setImage(imageConfig);
        if (firstDisplay.current < 3) {
            firstDisplay.current = firstDisplay.current + 1;
            imagePhase.current = imageConfig.listWave.map(() => WavePhase.DISPLAYED);
        }
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