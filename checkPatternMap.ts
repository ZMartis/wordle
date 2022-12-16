import { readFileSync } from 'fs'

interface GuessMap {
  [key: string]: PatternMap
}

interface PatternMap {
  [key: string]: string[]
}

const mapping: GuessMap = JSON.parse(
  readFileSync('data/patternMap.json', 'utf-8')
)

console.log(mapping['aahed'])
