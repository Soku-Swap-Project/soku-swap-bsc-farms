import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = ['https://speedy-nodes-nyc.moralis.io/a80a9a59f7e3ae9405c48919/bsc/mainnet']

// console.log(process.env, 'dotenv')

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return 'https://speedy-nodes-nyc.moralis.io/a80a9a59f7e3ae9405c48919/bsc/mainnet'
}

export default getNodeUrl
