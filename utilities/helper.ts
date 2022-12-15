import { clone, each, filter, includes, indexOf, map, split } from 'lodash'
import { LetterData } from '../types'
import { textGreen, textGrey, textYellow } from './colors'

export default function guessHelper(
  guessedWords: string[],
  answer: string,
  remainingHelperWords: string[]
) {
  // iterate over list of all words and

  console.log('helper not yet active')
}

export function filterRemainingWords(
  helperWords: string[],
  guessData: LetterData[]
): string[] {
  let filteredHelperWords = clone(helperWords)

  each(guessData, (letterData, index) => {
    if (letterData.state === 'exact') {
      filteredHelperWords = filter(
        filteredHelperWords,
        (word) => word[index] === letterData.letter
      )
    } else if (letterData.state === 'inAnswer') {
      filteredHelperWords = filter(filteredHelperWords, (word) =>
        includes(word, letterData.letter)
      )
    } else {
      filteredHelperWords = filter(
        filteredHelperWords,
        (word) => !includes(word, letterData.letter)
      )
    }
  })

  return filteredHelperWords
}
