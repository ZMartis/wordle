import { readFileSync, writeFileSync } from 'fs'
import {
  clone,
  each,
  filter,
  includes,
  indexOf,
  join,
  map,
  split,
} from 'lodash'
import possiblePatterns from '../data/possiblePatterns.json'
import { State } from '../types'

interface GuessMap {
  [key: string]: PatternMap
}

interface PatternMap {
  [key: string]: string[]
}

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

for (let i = 0; i < allowedWords.length; i++) {
  const mapping: GuessMap = JSON.parse(
    readFileSync('data/patternMap.json', 'utf-8')
  )

  const guess = allowedWords[i]

  mapping[guess] = {}

  each(possiblePatterns, (pattern) => {
    const stringPattern = join(pattern, ',')
    mapping[guess][stringPattern] = filter(allowedWords, (word) => {
      return stringPattern === patternForWord(guess, word)
    })
  })
  writeFileSync('data/patternMap.json', JSON.stringify(mapping))
}

// --------------------------

function patternForWord(guess: string, word: string): string {
  const spliceableWord = split(clone(word), '')
  const checkedGreenLetters = map(guess, (letter, index) => {
    if (letter === word[index]) {
      spliceableWord.splice(index, 1, '*')
      return State.Exact
    } else {
      return letter
    }
  })
  return join(
    map(checkedGreenLetters, (letter) => {
      if (includes(spliceableWord, letter)) {
        spliceableWord.splice(indexOf(spliceableWord, letter), 1)
        return State.InAnswer
      } else if (letter.length === 1) {
        return State.NotInAnswer
      } else {
        return letter
      }
    }),
    ','
  )
}
