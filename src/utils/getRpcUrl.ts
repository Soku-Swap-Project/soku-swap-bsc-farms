import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [
  'https://bsc-dataseed4.ninicoin.io/'
]

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://bsc-dataseed4.ninicoin.io/'
}

export default getNodeUrl
