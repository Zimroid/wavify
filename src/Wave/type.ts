export default interface WaveConfig {
    nbPeriod: number,
    intensity: number,
    color: string,
    phase: WavePhase,
}

export enum WavePhase {
    DISPLAYED,
    WHITE_LINE,
    WHITE_LINE_PREPARATION
}
