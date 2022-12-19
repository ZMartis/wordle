import { readFileSync, writeFileSync } from 'fs'
import { split } from 'lodash'
import { guessPatternProbabilityMap } from '../utilities/utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const possibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

const patternProbabilityMap = guessPatternProbabilityMap(
  allowedWords,
  possibleAnswers
)

writeFileSync('data/patternMap.json', JSON.stringify(patternProbabilityMap))
