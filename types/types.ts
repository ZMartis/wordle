export interface LetterData {
  letter: string
  state: State | undefined
}

export enum State {
  Exact = 'E',
  Included = 'I',
  Miss = 'M',
}

export interface PatternProbabilityMap {
  [key: string]: PatternCount
}

export interface PatternCount {
  [key: string]: number
}

export interface GuessInformation {
  guess: string
  information: number
}
