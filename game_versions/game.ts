import { readFileSync } from 'fs'
import { clone, includes, lowerCase, map, random, split } from 'lodash'
import { State } from '../types/types'
import {
  computeGuessPattern,
  filterRemainingWords,
} from '../utilities/utilities'
import {
  textCyan,
  textDefault,
  textGreen,
  textGrey,
  textRed,
  textYellow,
} from '../utilities/colors'
import { guessHelper } from '../commands/help'
import userInput from '../utilities/userInput'

// --------------------------------------------------

const validWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const allPossibleAnswers = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

const commands = ['help']
const guessLimit = 6
let currentGuessNumber = 1

// ---------------------------------------------

// TODO: Change all console.logs to a better UI with Node process.stdout

function runGame() {
  const answer = allPossibleAnswers[random(0, allPossibleAnswers.length - 1)]
  const guessedWords: string[] = []

  currentGuessNumber = 1
  let possibleAnswers = clone(allPossibleAnswers)

  while (!includes(guessedWords, answer) && currentGuessNumber <= guessLimit) {
    // TODO: before this guess code the code to get the next best guess should start being run async
    const guess = handleInput(userInput())

    if (includes(commands, guess)) {
      handleCommands(currentGuessNumber, guess, possibleAnswers)
    } else {
      guessedWords.push(guess)
      currentGuessNumber++

      const guessPattern = computeGuessPattern(guess, answer)

      possibleAnswers = filterRemainingWords(
        possibleAnswers,
        guess,
        guessPattern
      )

      console.log(...displayGuess(guess, guessPattern), textDefault)
    }
  }

  finishGame(guessedWords, answer)
}

// ----------------

function handleInput(input: string) {
  while (
    (input.length !== 5 || !includes(validWords, input)) &&
    !includes(commands, input)
  ) {
    if (input.length !== 5) {
      console.log(textRed + 'Guess must be 5 letters', textDefault)
    } else {
      console.log(textRed + 'Not in word list', textDefault)
    }
    input = userInput()
  }

  return input
}

function handleCommands(
  currentGuessNumber: number,
  command: string,
  remainingHelperWords: string[]
) {
  switch (command) {
    case 'help':
      guessHelper(currentGuessNumber, remainingHelperWords)
      break

    default:
      break
  }
}

function displayGuess(guess: string, guessPattern: string): string[] {
  return map(guessPattern, (letterState, index) => {
    if (letterState === State.Exact) {
      return textGreen + guess[index]
    } else if (letterState === State.Included) {
      return textYellow + guess[index]
    } else {
      return textGrey + guess[index]
    }
  })
}

function finishGame(guessedWords: string[], answer: string): void {
  if (includes(guessedWords, answer)) {
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

runGame()
