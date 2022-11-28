import { readFileSync } from 'fs'
import { split } from 'lodash-es'

const allowedWords = split(readFileSync('data/allowedWords.txt', 'utf-8'), '\n')

cons
