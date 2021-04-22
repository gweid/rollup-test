import { formatPrice } from './utils/tools'
import { msg } from './utils/common'
import _ from 'lodash'
import './style/common.css'

const sum = (num1, num2) => {
  return num1 + num2
}

console.log(sum(1, 2))
console.log(formatPrice(19.9996))
console.log(msg)
console.log(_.merge({name: 'hahaha'}, {age: 18}))

export {
  sum
}
