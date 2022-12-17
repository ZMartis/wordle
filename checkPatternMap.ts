import { readFileSync } from 'fs'
import { GuessMap } from './types'

const mapping: GuessMap = JSON.parse(
  readFileSync('data/patternMap.json', 'utf-8')
)

console.log(mapping['aahed'])
