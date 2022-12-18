import { readFileSync } from 'fs'
import { each, filter, split } from 'lodash'
import { PatternProbabilityMap } from '../types/types'
import { bestWord } from '../utilities/findBestFirstGuessFitToPossible'

import possiblePatterns from '../data/possiblePatterns.json'
import {
  computeGuessPattern,
  weightedAverageGuessInformationList,
} from '../utilities/utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

let mapping: PatternProbabilityMap = {}

export function guessHelper(
  guessNumber: number,
  remainingHelperWords: string[]
) {
  if (guessNumber === 1) {
    console.log(bestWord)
  } else {
    fillGuessMapping(remainingHelperWords)
    console.log(
      weightedAverageGuessInformationList(
        remainingHelperWords,
        remainingHelperWords,
        mapping
      )[0]
    )
  }
}

function fillGuessMapping(remainingHelperWords: string[]) {
  for (let i = 0; i < allowedWords.length; i++) {
    const guess = allowedWords[i]
    mapping[guess] = {}

    each(possiblePatterns, (pattern) => {
      mapping[guess][pattern] = 0
    })
    each(remainingHelperWords, (word) => {
      const stringPattern = computeGuessPattern(guess, word)
      mapping[guess][stringPattern] += 1
    })
  }
}

// ------------------------

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
