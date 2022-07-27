import tokens from './tokens'
import LpTokens from './LpTokens'
import { PoolConfig as FarmsWithSmartChefConfig, PoolCategory as FarmsWithSmartChefCategory } from './types'

const farmsWithSmartChef: FarmsWithSmartChefConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: tokens.suteku,
  //   earningToken: tokens.suteku,
  //   contractAddress: {
  //     97: '0x186B09041249bf6438543e67580824F6647323B1',
  //     56: '0x2A62a4F578011c5C978F8c111338CD7Be740CFEF',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '0.1',
  //   sortOrder: 1,
  //   isFinished: false,
  // },

  // {
  //   sousId: 7,
  //   stakingToken: LpTokens.hobi_wbnb,
  //   earningToken: tokens.hobi,
  //   contractAddress: {
  //     97: '',
  //     56: '0x6c25710BC684a67F8A5e49D02Bd9610dBB5c3b6b',
  //   },
  //   poolCategory: FarmsWithSmartChefCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '1',
  //   sortOrder: 999,
  //   isFinished: false,
  // },

  {
    sousId: 1,
    stakingToken: LpTokens.hobi_wbnb,
    earningToken: tokens.hobi,
    contractAddress: {
      97: '',
      56: '0x75D951F17507D63d1c74Ce801A5C336809DB4bc6',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 2,
    stakingToken: LpTokens.hobi_suteku,
    earningToken: tokens.hobi,
    contractAddress: {
      97: '',
      56: '0x3e9964Ad64761100929C8756e95B11D32Ba62DE2',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 4,
    stakingToken: LpTokens.soku_bnb,
    earningToken: tokens.hobi,
    contractAddress: {
      97: '',
      56: '0x3bc842Af95f0c01AB35Ed8d5EDa2437d37Ab0911',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
  {
    sousId: 3,
    stakingToken: LpTokens.suteku_bnb,
    earningToken: tokens.hobi,
    contractAddress: {
      97: '',
      56: '0x6F546e4F9C38799073a779ca06d5Ae7EF8b107FB',
    },
    poolCategory: FarmsWithSmartChefCategory['30DAYLOCK'],
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default farmsWithSmartChef
