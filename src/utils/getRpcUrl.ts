import random from 'lodash/random'

// Array of available nodes to connect to
export const nodes = [
  process.env.BSC_PUBLIC_NODE_1,
  process.env.BSC_PUBLIC_NODE_2,
  process.env.BSC_PUBLIC_NODE_3,
  process.env.BSC_PUBLIC_NODE_4,
  process.env.BSC_PUBLIC_NODE_5,
  process.env.BSC_PUBLIC_NODE_6,
  process.env.BSC_PUBLIC_NODE_7,
  process.env.BSC_PUBLIC_NODE_8,
  process.env.BSC_PUBLIC_NODE_9,
  process.env.BSC_PUBLIC_NODE_10,
]

const getNodeUrl = () => {
  const randomIndex = random(0, nodes.length - 1)
  return nodes[randomIndex]
}

export default getNodeUrl
