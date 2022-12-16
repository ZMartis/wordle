import { clone, each, filter, includes } from 'lodash'
import { LetterData } from '../types'

export default function guessHelper(remainingHelperWords: string[]) {
  // what word will get me the most information to narrow down the remaining words

  console.log(remainingHelperWords)
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
