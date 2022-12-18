import { readFileSync } from 'fs'
import { orderBy, split } from 'lodash'
import { PatternProbabilityMap } from '../types/types'
import { weightedAverageGuessInformationList } from './utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const possibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

const patternProbabilityMap: PatternProbabilityMap = JSON.parse(
  readFileSync('data/possibleChosenWordsPatternMap.json', 'utf-8')
)

const orderedWordList = orderBy(
  weightedAverageGuessInformationList(
    allowedWords,
    possibleAnswers,
    patternProbabilityMap
  ),
  ['information'],
  'desc'
)

export const bestWord = orderedWordList[0]
