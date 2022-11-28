import PromptSync from 'prompt-sync'

const prompt = PromptSync()

export default function userInput(inputPrompt = 'Guess: ') {
  return prompt(inputPrompt)
}
