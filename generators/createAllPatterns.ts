import { writeFileSync } from 'fs'
import { join, map } from 'lodash'
import { State } from '../types/types'

const mapping: string[] = []

for (let i = 0; i < 3 ** 5; i++) {
  let trinaryString = i.toString(3)
  while (trinaryString.length < 5) {
    trinaryString = '0' + trinaryString
  }
  mapping.push(
    join(
      map(trinaryString, (number) => {
        switch (number) {
          case '0':
            return State.Miss
          case '1':
            return State.Included
          case '2':
            return State.Exact
          default:
            return State.Miss
        }
      }),
      ''
    )
  )
}

writeFileSync('data/possiblePatterns.json', JSON.stringify(mapping))
