import { readFileSync } from 'fs'
import { GuessMap } from '../types/types'

const mapping: GuessMap = JSON.parse(
  readFileSync('data/compressedPatternMap.json', 'utf-8')
)

console.log(mapping['aahed'])
