export interface LetterData {
  letter: string
  state: State | undefined
}

export enum State {
  Exact = 'E',
  Included = 'I',
  Miss = 'M',
}

export interface GuessMap {
  [key: string]: PatternMap
}

export interface PatternMap {
  [key: string]: number
}
