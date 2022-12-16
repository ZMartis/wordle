import { writeFileSync } from 'fs'
import { map } from 'lodash'
import { State } from '../types'

const mapping: State[][] = []

for (let i = 0; i < 3 ** 5; i++) {
  let trinaryString = i.toString(3)
  while (trinaryString.length < 5) {
    trinaryString = '0' + trinaryString
  }
  mapping.push(
    map(trinaryString, (number) => {
      switch (number) {
        case '0':
          return State.NotInAnswer
        case '1':
          return State.InAnswer
        case '2':
          return State.Exact
        default:
          return State.NotInAnswer
      }
    })
  )
}

writeFileSync('data/possiblePatterns.json', JSON.stringify(mapping))
