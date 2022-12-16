export interface LetterData {
  letter: string
  state: State | undefined
}

export enum State {
  Exact = 'exact',
  InAnswer = 'inAnswer',
  NotInAnswer = 'notInAnswer',
}
