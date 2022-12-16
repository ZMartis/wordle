import { existsSync, readFileSync, writeFileSync } from 'fs'
import { clone, each, includes, indexOf, join, map, split } from 'lodash'
import possiblePatterns from '../data/possiblePatterns.json'
import { GuessMap, State } from '../types'

// Don't save the list; save the length of the filtered list.

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

for (let i = 0; i < allowedWords.length; i++) {
  let mapping: GuessMap = {}

  if (existsSync('data/patternMap.json')) {
    mapping = JSON.parse(readFileSync('data/patternMap.json', 'utf-8'))
  }

  const guess = allowedWords[i]

  mapping[guess] = {}

  each(possiblePatterns, (pattern) => {
    mapping[guess][join(pattern, ',')] = 0
  })

  each(allowedWords, (word) => {
    const stringPattern = patternForWord(guess, word)
    mapping[guess][stringPattern] += 1
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
