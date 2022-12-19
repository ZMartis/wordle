import { readFileSync } from 'fs'
import { split } from 'lodash'
import {
  guessPatternProbabilityMap,
  weightedAverageGuessInformationList,
} from '../utilities/utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const allPossibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

export function guessHelper(guessNumber: number, possibleAnswers: string[]) {
  if (guessNumber === 1) {
    const patternProbabilityMap = JSON.parse(
      readFileSync('data/patternMap.json', 'utf-8')
    )
    console.log(
      weightedAverageGuessInformationList(
        allowedWords,
        allPossibleAnswers,
        patternProbabilityMap
      )[0]
    )
  } else {
    const patternProbabilityMap = guessPatternProbabilityMap(
      possibleAnswers,
      possibleAnswers
    )
    console.log(
      weightedAverageGuessInformationList(
        possibleAnswers,
        possibleAnswers,
        patternProbabilityMap
      )[0]
    )
  }
}
