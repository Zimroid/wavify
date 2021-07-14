export interface Color {
    r: string;
    g: string;
    b: string;
    a: string;
}

export interface Box {
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
  
export interface ImageWavified {
    id: number;
    listWave: WaveConfig[];
    darkest: number;
    brightest: number;
}