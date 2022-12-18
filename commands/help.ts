import { readFileSync } from 'fs'
import { each, filter, split } from 'lodash'
import { PatternProbabilityMap } from '../types/types'
import possiblePatterns from '../data/possiblePatterns.json'
import {
  computeGuessPattern,
  weightedAverageGuessInformationList,
} from '../utilities/utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const allPossibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

let patternProbabilityMap: PatternProbabilityMap = {}

export function guessHelper(guessNumber: number, possibleAnswers: string[]) {
  if (guessNumber === 1) {
    patternProbabilityMap = JSON.parse(
      readFileSync('data/possibleChosenWordsPatternMap.json', 'utf-8')
    )
    console.log(
      weightedAverageGuessInformationList(
        allowedWords,
        allPossibleAnswers,
        patternProbabilityMap
      )[0]
    )
  } else {
    fillGuesspatternProbabilityMap(possibleAnswers)
    console.log(
      weightedAverageGuessInformationList(
        possibleAnswers,
        possibleAnswers,
        patternProbabilityMap
      )[0]
    )
  }
}

function fillGuesspatternProbabilityMap(possibleAnswers: string[]) {
  for (let i = 0; i < allowedWords.length; i++) {
    const guess = allowedWords[i]
    patternProbabilityMap[guess] = {}

    each(possiblePatterns, (pattern) => {
      patternProbabilityMap[guess][pattern] = 0
    })
    each(possibleAnswers, (word) => {
      const stringPattern = computeGuessPattern(guess, word)
      patternProbabilityMap[guess][stringPattern] += 1
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
