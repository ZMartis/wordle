import { readFileSync } from 'fs'
import {
  clone,
  each,
  includes,
  indexOf,
  lowerCase,
  map,
  random,
  split,
} from 'lodash'
import { LetterData } from './types'
import {
  textCyan,
  textDefault,
  textGreen,
  textGrey,
  textRed,
  textYellow,
} from './utilities/colors'
import guessHelper, { filterRemainingWords } from './utilities/helper'
import userInput from './utilities/userInput'

// --------------------------------------------------

const validWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const possibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)
const commands = ['help']
const guessLimit = 6

// ---------------------------------------------

function runGame() {
  const answer = possibleAnswers[random(0, possibleAnswers.length - 1)]
  const guessedWords: string[] = []
  const guessedWordsData: LetterData[][] = []

  console.log(answer)

  let currentGuess = 1
  let remainingHelperWords = clone(validWords)

  while (!foundAnswer(guessedWords, answer) && currentGuess <= guessLimit) {
    const guess = handleInput(userInput())

    if (includes(commands, guess)) {
      handleCommands(guess, guessedWords, answer, remainingHelperWords)
    } else {
      guessedWords.push(guess)
      currentGuess++

      const guessData = getGuessData(guess, answer)
      guessedWordsData.push(guessData)

      remainingHelperWords = filterRemainingWords(
        remainingHelperWords,
        guessData
      )

      console.log(...displayableLetters(guessData), textDefault)
    }
  }

  finishGame(guessedWords, answer)
}

// ----------------

function getGuessData(guess: string, answer: string): LetterData[] {
  const guessData: LetterData[] = []

  let splicableAnswer = split(clone(answer), '')

  const greenLettersChecked = map(guess, (letter, index) => {
    if (letter === answer[index]) {
      guessData.push({ letter: letter, state: 'exact' })
      splicableAnswer.splice(index, 1, '*')
      return '*'
    } else {
      guessData.push({ letter: letter, state: undefined })
      return letter
    }
  })
  each(greenLettersChecked, (letter, index) => {
    if (letter !== '*') {
      if (includes(splicableAnswer, letter)) {
        guessData[index].state = 'inAnswer'
        splicableAnswer.splice(indexOf(splicableAnswer, letter), 1)
      } else {
        guessData[index].state = 'notInAnswer'
      }
    }
  })

  return guessData
}

function displayableLetters(guessData: LetterData[]): string[] {
  return map(guessData, (letterData) => {
    if (letterData.state === 'exact') {
      return textGreen + letterData.letter
    } else if (letterData.state === 'inAnswer') {
      return textYellow + letterData.letter
    } else {
      return textGrey + letterData.letter
    }
  })
}

function handleInput(input: string) {
  if (!includes(commands, input)) {
    while (input.length !== 5 || !includes(validWords, input)) {
      if (input.length !== 5) {
        console.log(textRed + 'Guess must be 5 letters', textDefault)
      } else {
        console.log(textRed + 'Not in word list', textDefault)
      }
      input = userInput()
    }
  }
  return input
}

function handleCommands(
  command: string,
  guessedWords: string[],
  answer: string,
  remainingHelperWords: string[]
) {
  switch (command) {
    case 'help':
      guessHelper(guessedWords, answer, remainingHelperWords)
      break

    default:
      break
  }
}

function finishGame(guessedWords: string[], answer: string): void {
  if (foundAnswer(guessedWords, answer)) {
    console.log(textCyan + 'Congratulations! You Won!', textDefault)
  } else {
    console.log(textRed + 'You Loose!', textDefault)
    console.log(`The word was ${answer}.`)
  }

  if (lowerCase(userInput('Play again? Y/n: ')) === 'y') {
    runGame()
  } else {
    console.log('Thank you for playing!')
    return
  }
}

function foundAnswer(guessedWords: string[], answer: string): boolean {
  return includes(guessedWords, answer)
}

runGame()
