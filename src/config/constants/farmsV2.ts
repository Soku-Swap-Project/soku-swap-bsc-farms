import tokens from './tokens'
import { FarmConfig } from './types'

const farmsV2: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'SUTEKU',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x198800aF50914004A9E9D19cA18C0b24587a50cf',
    },
    token: tokens.suteku,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'SOKU-SUTEKU LP',
    lpAddresses: {
      97: '',
      56: '0x9Cd57015Bc8656a5B80e802335A5Ce464a6569B0',
    },
    token: tokens.suteku,
    quoteToken: tokens.soku,
  },
]

export default farmsV2
