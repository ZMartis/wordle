import { existsSync, readFileSync, writeFileSync } from 'fs'
import {
  clone,
  each,
  includes,
  indexOf,
  join,
  map,
  split,
  upperCase,
} from 'lodash'
import possiblePatterns from '../data/possiblePatterns.json'
import { GuessMap } from '../types'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

const compressedPossiblePatterns = map(possiblePatterns, (pattern) =>
  map(pattern, (state) => upperCase(state[0]))
)

let mapping: GuessMap = {}

if (existsSync('data/compressedPatternMap.json')) {
  mapping = JSON.parse(readFileSync('data/compressedPatternMap.json', 'utf-8'))
}

for (let i = 0; i < allowedWords.length; i++) {
  const guess = allowedWords[i]

  if (mapping[guess]) {
    continue
  }

  mapping[guess] = {}

  each(compressedPossiblePatterns, (pattern) => {
    mapping[guess][join(pattern, ',')] = 0
  })

  each(allowedWords, (word) => {
    const stringPattern = patternForWord(guess, word)
    mapping[guess][stringPattern] += 1
  })

  writeFileSync('data/compressedPatternMap.json', JSON.stringify(mapping))
  console.log(guess)
}

function patternForWord(guess: string, word: string): string {
  const spliceableWord = split(clone(word), '')
  const checkedGreenLetters = map(guess, (letter, index) => {
    if (letter === word[index]) {
      spliceableWord.splice(index, 1, '*')
      return 'E'
    } else {
      return letter
    }
  })
  return join(
    map(checkedGreenLetters, (letter) => {
      if (includes(spliceableWord, letter)) {
        spliceableWord.splice(indexOf(spliceableWord, letter), 1)
        return 'I'
      } else if (letter.length === 1) {
        return 'N'
      } else {
        return letter
      }
    }),
    ','
  )
}
