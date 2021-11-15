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
    pid: 2,
    lpSymbol: 'SOKU-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x78EA31475cB284Dc9Bd70f06db457Fdba19C9Ad7',
    },
    token: tokens.soku,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'SOKU-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x66C2E8A1f02997C3B4A86334D8D31cd31e3a75Af',
    },
    token: tokens.soku,
    quoteToken: tokens.busd,
  },
  {
    pid: 4,
    lpSymbol: 'SOKU-YUMMY LP',
    lpAddresses: {
      97: '',
      56: '0x860b771eC2D0e8ecf3e2315aAD7a24Ba3228D968',
    },
    token: tokens.soku,
    quoteToken: tokens.yummy,
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
  {
    pid: 5,
    lpSymbol: 'SUTEKU-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1BcD5AA4EeCbfc6D048D553E8F385683D9DF6E15',
    },
    token: tokens.suteku,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 6,
    lpSymbol: 'SUTEKU-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8568eb12B54128070AdA50b0909d990FecbBc03f',
    },
    token: tokens.suteku,
    quoteToken: tokens.busd,
  },
]

export default farmsV2
