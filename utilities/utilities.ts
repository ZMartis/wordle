import {
  clone,
  each,
  filter,
  includes,
  indexOf,
  join,
  map,
  orderBy,
  split,
  sum,
} from 'lodash'
import { GuessInformation, PatternProbabilityMap, State } from '../types/types'
import possiblePatterns from '../data/possiblePatterns.json'

export function computeGuessPattern(guess: string, answer: string) {
  const editableAnswer = split(clone(answer), '')

  const foundExactMatches = map(guess, (letter, index) => {
    if (letter === answer[index]) {
      editableAnswer.splice(index, 1, '_')
      return '*'
    } else {
      return letter
    }
  })
  return join(
    map(foundExactMatches, (letter) => {
      if (includes(editableAnswer, letter)) {
        editableAnswer.splice(indexOf(editableAnswer, letter), 1)
        return State.Included
      } else if (letter === '*') {
        return State.Exact
      } else {
        return State.Miss
      }
    }),
    ''
  )
}

export function probabilitySpace(
  patternOccurancesCount: number,
  possibleAnswersCount: number
) {
  return patternOccurancesCount / possibleAnswersCount
}

export function safeLog2(
  patternOccurancesCount: number,
  possibleAnswersCount: number
) {
  if (patternOccurancesCount > 0) {
    return Math.log2(
      1 / probabilitySpace(patternOccurancesCount, possibleAnswersCount)
    )
  } else {
    return 0
  }
}

export function weightedAverageGuessInformationList(
  guessWordList: string[],
  possibleAnswerWordList: string[],
  patternProbabilityMap: PatternProbabilityMap
) {
  let guessInformationArray: GuessInformation[] = []

  each(guessWordList, (guess) => {
    const informationForGuess = map(
      possiblePatterns,
      (pattern) =>
        probabilitySpace(
          patternProbabilityMap[guess][pattern],
          possibleAnswerWordList.length
        ) *
        safeLog2(
          patternProbabilityMap[guess][pattern],
          possibleAnswerWordList.length
        )
    )
    guessInformationArray.push({ guess, information: sum(informationForGuess) })
  })

  return orderBy(guessInformationArray, ['information'], 'desc')
}

export function filterRemainingWords(
  possibleAnswers: string[],
  guess: string,
  guessPattern: string
): string[] {
  return filter(possibleAnswers, (possibleAnswer) => {
    const pattern = computeGuessPattern(guess, possibleAnswer)
    return guessPattern === pattern
  })
}

export function guessPatternProbabilityMap(
  guessWordList: string[],
  possibleAnswerWordList: string[]
) {
  const patternProbabilityMap: PatternProbabilityMap = {}

  each(guessWordList, (guess) => {
    patternProbabilityMap[guess] = {}
    each(possiblePatterns, (pattern) => {
      patternProbabilityMap[guess][pattern] = 0
    })
    each(possibleAnswerWordList, (possibleAnswer) => {
      const stringPattern = computeGuessPattern(guess, possibleAnswer)
      patternProbabilityMap[guess][stringPattern] += 1
    })
  })

  return patternProbabilityMap
}
