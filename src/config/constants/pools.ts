import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: tokens.soku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '0x186B09041249bf6438543e67580824F6647323B1',
  //     56: '0x800522017eA0f36a358cda3Be52C7Aa4F157838B',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '0.1',
  //   sortOrder: 1,
  //   isFinished: false,
  // },
  {
    sousId: 18,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x168F5ebB917A3FAee00c3433d0D7Cc3A1F9260b8',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.2',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 21,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0xC9674A951e6Ae2659C2A583Fb6E30775E6D840fd',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '4',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 22,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x8A91Ad281611ED446eB23F9619c1f007e8a7757E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.2',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 23,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x2268e5E07cDD4f5a23E56f9537659698459DB41D',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.3',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 24,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x047a0B0C8eE1479750Bc664B6088Fa9051b60CC8',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 25,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0xB80Db5fAE9098bAeEdD91D17Af4Ff6a918732Ba3',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.3',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 26,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0xb5c2E7EBF8cd27C0bfE4db47A4B5b84d8454004C',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 27,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x0f55C0E5973e2Ce5e19E07Bb2893B3724A1e8f0E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.25',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 28,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x60D1D306Ea6b10eBd27C6Cfc2C707eD2adCF8577',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 29,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x18Ceef1B49834d0Fb31b5497154B9C41ef863129',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.35',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 30,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0xE24b9a8d1bA5d1884ce7D0A5484c3cfbdaF718F0',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 31,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0xf372b5CD5da8e7D42d1FD38d5C2CA839496ddf3C',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.5',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 32,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x5089123f3E99250aC931fA843bA1AFfd352B818F',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 33,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x21C67a6e0B6a1083A4D775eB11AE3f7802A79bAd',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.5',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 34,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x5227279EaE702EDe7dc8E335dC55E8e11cc9640E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 35,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0xa0E396c5Ff9AAD1Effc32efbFDD7A36E74F8a063',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 36,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x5877bDf1f5Aeb3C1352697436D1AdB5DC1a603e7',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 37,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x26fBe76C3a326A3EcD686b5a918c88Ba12B683Ef',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1.5',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 38,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x60C122084a3CBec9D85e83c335851C909a41c68a',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 39,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0x44fCf3C451F000665b43193EA5842C56EFA6aB83',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1.5',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 40,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x3385e644170985a604855c40Fef7F4daDd97822E',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 41,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0xE80453281845c5B37F352b933F0D50A62e6f195d',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1.5',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 42,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0xecd3174Bf8681259A3798581679CDf18b79f07f0',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 43,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku,
    contractAddress: {
      97: '',
      56: '0xc8F4978C5e66f2CC4bA029a50E6fb21d5093fd22',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.75',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 44,
    stakingToken: tokens.suteku,
    earningToken: tokens.soku,
    contractAddress: {
      97: '',
      56: '0x0FA4b26183120eD076CEcCB4C4baE10Cd3b1b788',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.3',
    sortOrder: 999,
    isFinished: false,
  },

  // New Locked Staking Pools

  // {
  //   sousId: 1,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xFc810EAe05eCdfAC3E77d49b97bAA689e8a38486',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.00001',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 2,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0x012cdAf3D3425D0A4E76e83e77a84a7921502719',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 1,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xA4817Bc1F611275B40b2dcf335d5B20Aa2513C34',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 1,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0x5c18Cc20ec43D296098120Dc616434F0fbC35406',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 2,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0x2228584178ef6362A371Ec0C37061e74eb1F225b',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 1,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0x5052ce93d8B3550D5A3b5e98609C78c2BB9C3483',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished:
  // {
  //   sousId: 43,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xa4f702af71c536c542c067245E7c8bB411B3A05E',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 44,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xF8a9b3a1F9932A2f9fb0325ae54836970Ec9Cdf6',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 45,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xcF4947BA8460a97a1da1D3734888fC6Aa70CDd2d',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 45,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0xA9874a1d6917E1fFe844fB0404f72a017c09c3DD',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  // {
  //   sousId: 46,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.soku,
  //   contractAddress: {
  //     97: '',
  //     56: '0x8e36B4834F3Fc94b45c65851ca30D62C57417179',
  //   },
  //   poolCategory: PoolCategory.LOCKED,
  //   harvest: true,
  //   tokenPerBlock: '0.01',
  //   sortOrder: 999,
  //   isFinished: false,
  // },
  {
    sousId: 11,
    stakingToken: tokens.soku,
    earningToken: tokens.suteku1,
    contractAddress: {
      97: '',
      56: '0x21B4AC2754282Da23e61c748D5De3b29C94e103C',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default pools
