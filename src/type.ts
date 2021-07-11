export interface color {
    r: string;
    g: string;
    b: string;
    a: string;
}

export interface box {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

export interface WaveConfig {
    grey: number;
    x: number;
    y: number;
    color: string;
}
  
export interface imageWavified {
    id: number;
    listWave: WaveConfig[];
    darkest: number;
    brightest: number;
}