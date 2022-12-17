import { readFileSync } from 'fs'
import { clone, includes, indexOf, lowerCase, map, random, split } from 'lodash'
import userInput from '../utilities/userInput'
import {
  textGrey,
  textGreen,
  textYellow,
  textRed,
  textCyan,
  textDefault,
} from '../utilities/colors'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')
const possibleChosenWords = split(
  readFileSync('data/possibleChosenWords.txt', 'utf-8'),
  '\n'
)

function run() {
  const numberOfGuesses = 6
  let currentGuess = 1
  const chosenWord =
    possibleChosenWords[random(0, possibleChosenWords.length - 1)]
  const guessedWords: string[] = []

  while (
    currentGuess <= numberOfGuesses &&
    !includes(guessedWords, chosenWord)
  ) {
    let guess = getValidGuess()
    guessedWords.push(guess)
    currentGuess++
    console.log(...checkLetters(guess, chosenWord), textDefault)
  }

  if (includes(guessedWords, chosenWord)) {
    console.log(textCyan + 'Congratulations! You Won!', textDefault)
  } else {
    console.log(textRed + 'You Loose!', textDefault)
    console.log(`The word was ${chosenWord}.`)
  }

  if (lowerCase(userInput('Play again? Y/n: ')) === 'y') {
    run()
  } else {
    console.log('Thank you for playing!')
    return
  }
}

function getValidGuess() {
  let guess = userInput()
  while (guess.length !== 5 || !includes(allowedWords, guess)) {
    if (guess.length !== 5) {
      console.log(textRed + 'Guess must be 5 letters', textDefault)
    } else {
      console.log(textRed + 'Not in word list', textDefault)
    }
    guess = userInput()
  }
  return guess
}

function checkLetters(guess: string, chosenWord: string) {
  const spliceableChosenWord = split(clone(chosenWord), '')
  const checkedGreenLetters = map(guess, (letter, index) => {
    if (letter === chosenWord[index]) {
      spliceableChosenWord.splice(index, 1, '*')
      return textGreen + letter
    } else {
      return letter
    }
  })
  return map(checkedGreenLetters, (letter) => {
    if (includes(spliceableChosenWord, letter)) {
      spliceableChosenWord.splice(indexOf(spliceableChosenWord, letter), 1)
      return textYellow + letter
    } else {
      return textGrey + letter
    }
  })
}

run()
