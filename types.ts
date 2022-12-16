export interface LetterData {
  letter: string
  state: State | undefined
}

export enum State {
  Exact = 'exact',
  InAnswer = 'inAnswer',
  NotInAnswer = 'notInAnswer',
}

export interface GuessMap {
  [key: string]: PatternMap
}

export interface PatternMap {
  [key: string]: number
}
