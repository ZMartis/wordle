import { existsSync, readFileSync, writeFileSync } from 'fs'
import { each, split } from 'lodash'
import possiblePatterns from '../data/possiblePatterns.json'
import { PatternProbabilityMap } from '../types/types'
import { computeGuessPattern } from '../utilities/utilities'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const possibleChosenWords = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

let patternProbabilityMap: PatternProbabilityMap = {}

if (existsSync('data/possibleChosenWordsPatternMap.json')) {
  patternProbabilityMap = JSON.parse(
    readFileSync('data/possibleChosenWordsPatternMap.json', 'utf-8')
  )
}

for (let i = 0; i < allowedWords.length; i++) {
  const guess = allowedWords[i]

  patternProbabilityMap[guess] = {}

  each(possiblePatterns, (pattern) => {
    patternProbabilityMap[guess][pattern] = 0
  })

  each(possibleChosenWords, (word) => {
    const stringPattern = computeGuessPattern(guess, word)
    patternProbabilityMap[guess][stringPattern] += 1
  })

  console.log(guess)
}

writeFileSync(
  'data/possibleChosenWordsPatternMap.json',
  JSON.stringify(patternProbabilityMap)
)
