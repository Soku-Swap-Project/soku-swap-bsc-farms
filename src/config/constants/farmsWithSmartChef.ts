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

  // 90 Day Locked Staking Pools

  {
    sousId: 1,
    stakingToken: LpTokens.hobi_wbnb,
    earningToken: tokens.hobi,
    contractAddress: {
      97: '',
      56: '0x6c25710BC684a67F8A5e49D02Bd9610dBB5c3b6b',
    },
    poolCategory: FarmsWithSmartChefCategory.CORE,
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
      56: '0x51a72eb1844eed2220542eff1f96be36a91f02d6',
    },
    poolCategory: FarmsWithSmartChefCategory.CORE,
    harvest: true,
    tokenPerBlock: '1',
    sortOrder: 999,
    isFinished: false,
  },
]

export default farmsWithSmartChef
