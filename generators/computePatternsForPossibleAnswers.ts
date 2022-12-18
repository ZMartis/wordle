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

let mapping: PatternProbabilityMap = {}

if (existsSync('data/possibleChosenWordsPatternMap.json')) {
  mapping = JSON.parse(
    readFileSync('data/possibleChosenWordsPatternMap.json', 'utf-8')
  )
}

for (let i = 0; i < allowedWords.length; i++) {
  const guess = allowedWords[i]

  mapping[guess] = {}

  each(possiblePatterns, (pattern) => {
    mapping[guess][pattern] = 0
  })

  each(possibleChosenWords, (word) => {
    const stringPattern = computeGuessPattern(guess, word)
    mapping[guess][stringPattern] += 1
  })

  console.log(guess)
}

writeFileSync(
  'data/possibleChosenWordsPatternMap.json',
  JSON.stringify(mapping)
)
