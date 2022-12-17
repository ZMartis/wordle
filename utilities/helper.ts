import { clone, each, filter, includes } from 'lodash'
import { LetterData, State } from '../types/types'
import { bestWord } from './findBestFirstGuess'

export default function guessHelper(remainingHelperWords: string[]) {
  // what word will get me the most information to narrow down the remaining words

  console.log(bestWord)
}

// ------------------------

export function filterRemainingWords(
  helperWords: string[],
  guessData: LetterData[]
): string[] {
  let filteredHelperWords = clone(helperWords)

  each(guessData, (letterData, index) => {
    if (letterData.state === State.Exact) {
      filteredHelperWords = filter(
        filteredHelperWords,
        (word) => word[index] === letterData.letter
      )
    } else if (letterData.state === State.Included) {
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
