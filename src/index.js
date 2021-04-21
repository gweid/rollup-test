import { formatPrice } from './utils/tools'

const sum = (num1, num2) => {
  return num1 + num2
}

console.log(sum(1, 2))
console.log(formatPrice(19.9996))

export {
  sum
}