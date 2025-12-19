export interface FortuneMessage {
  id: number;
  cn: string;
  en: string;
}

export enum GameState {
  IDLE = 'IDLE',
  CRACKING = 'CRACKING',
  OPEN = 'OPEN',
  ZOOMED = 'ZOOMED'
}
