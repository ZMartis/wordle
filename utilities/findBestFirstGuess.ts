import { readFileSync } from 'fs'
import { each, join, map, orderBy, split, sum } from 'lodash'
import { GuessMap } from '../types/types'

import possiblePatterns from '../data/possiblePatterns.json'

const mapping: GuessMap = JSON.parse(
  readFileSync('data/patternMap.json', 'utf-8')
)

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

function possibilitySpace(number: number) {
  return number / allowedWords.length
}

function safeLog2(number: number) {
  if (number > 0) {
    return Math.log2(1 / possibilitySpace(number))
  } else {
    return 0
  }
}

function sumGuessInformationList() {
  let guessInformationArray: { guess: string; information: number }[] = []

  each(allowedWords, (guess) => {
    const informationForGuess = map(
      possiblePatterns,
      (pattern) =>
        // need to multiply the frequency of occurance by the information of the pattern
        possibilitySpace(mapping[guess][pattern]) *
        safeLog2(mapping[guess][pattern])
    )

    guessInformationArray.push({
      guess: guess,
      information: sum(informationForGuess),
    })
  })
  return guessInformationArray
}

// function allGuessInformationList() {
//   let guessInformationArray: {
//     guess: string
//     information: { pattern: string; value: number }[]
//   }[] = []

//   each(allowedWords, (guess) => {
//     const informationForGuess = map(possiblePatterns, (pattern) => {
//       return {
//         pattern: join(pattern, ','),
//         value:
//           // need to multiply the frequency of occurance by the information of the pattern
//           possibilitySpace(mapping[guess][join(pattern, ',')]) *
//           safeLog2(mapping[guess][join(pattern, ',')]),
//       }
//     })

//     guessInformationArray.push({
//       guess,
//       information: orderBy(informationForGuess, ['value'], 'asc'),
//     })
//   })

//   return guessInformationArray
// }

const orderedWordList = orderBy(
  sumGuessInformationList(),
  ['information'],
  'desc'
)

export const bestWord = orderedWordList[0]

console.log(orderedWordList)
