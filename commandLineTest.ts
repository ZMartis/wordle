import PromptSync from 'prompt-sync'

const prompt = PromptSync()

console.clear()

let line = 0
function userInput(inputPrompt = 'Guess: ') {
  const input = prompt(inputPrompt)
  process.stdout.cursorTo(0, line)
  process.stdout.clearLine(0)
  process.stdout.write(input)
  process.stdout.write('\n')

  line++
  return input
}

userInput()
userInput()
userInput()
