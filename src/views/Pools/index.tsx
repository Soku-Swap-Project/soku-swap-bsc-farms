import React, { useEffect, useMemo, useRef, useState } from 'react'
import ModalVideo from 'react-modal-video'

import { Route, useRouteMatch } from 'react-router-dom'

// import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex } from '@pancakeswap/uikit'
import { getAddress } from 'utils/addressHelpers'
import { AbiItem } from 'web3-utils'
import { getWeb3NoAccount } from 'utils/web3'
// import { Pool } from 'state/types'
// import Web3 from 'web3'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchCakeVault } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import PageHeader from 'components/PageHeader'
import PoolCard from './components/PoolCard'
import { fetchPoolsUserDataAsync } from '../../state/pools'
// import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
// import BountyCard from './components/BountyCard'

import 'react-modal-video/css/modal-video.css'

const NUMBER_OF_POOLS_VISIBLE = 12
// declare let window: any

const Pools: React.FC = () => {
  useFetchCakeVault()
  const { path } = useRouteMatch()
  // console.log('staking path', path)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const pools = usePools(account)

  // modal video
  const [isOpen, setOpen] = useState(false)

  const web3 = getWeb3NoAccount()
  // const newWeb3 = new Web3(Web3.givenProvider)
  const [stakedOnly, setStakedOnly] = usePersistState(false, 'pancake_pool_staked')
  const [staked, setStaked] = useState(0)
  const [userDetails, setUserDetails] = useState({})
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])

  const getUserData = async () => {
    const test = fetchPoolsUserDataAsync(account)
    console.log(test, ' test')
  }

  getUserData()

  const getStakingBalance = async (address) => {
    pools.map(async (pool) => {
      if (!pool.isFinished && account && pool) {
        try {
          if (
            pool.poolCategory === '30DayLock' ||
            pool.poolCategory === '60DayLock' ||
            pool.poolCategory === '90DayLock'
          ) {
            const abi = [
              { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
              {
                anonymous: false,
                inputs: [
                  { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'AdminTokenRecovery',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'ClaimReward',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Deposit',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'EmergencyWithdraw',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
                name: 'NewPoolLimit',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
                name: 'NewRewardPerBlock',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
                  { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
                ],
                name: 'NewStartAndEndBlocks',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Withdraw',
                type: 'event',
              },
              {
                inputs: [],
                name: 'PRECISION_FACTOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'SMART_CHEF_FACTORY',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'accTokenPerShare',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'addressEndLockTime',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'bonusEndBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              { inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'deposit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'emergencyRewardWithdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [],
                name: 'endLockTime',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
                name: 'getRemainingLockTime',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'hasAllRewardDistributedByAdmin',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'hasSavedPendingRewardUpdatedByAdmin',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'hasUserLimit',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
                  { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
                  { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_lockTime', type: 'uint256' },
                  { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
                  { internalType: 'address', name: '_admin', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [],
                name: 'isInitialized',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'lastRewardBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'lockTime',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'numberOfClaimCurrentAndTotalPendingReward',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'numberOfClaimSavedPendingReward',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
                name: 'pendingReward',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'poolLimitPerUser',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: '_tokenAddress', type: 'address' },
                  { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
                ],
                name: 'recoverWrongTokens',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [],
                name: 'rewardPerBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'rewardToken',
                outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'stakedToken',
                outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'startBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'temporaryPendingReward',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
                  { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
                ],
                name: 'updatePoolLimitPerUser',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
                name: 'updateRewardPerBlock',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
                ],
                name: 'updateStartAndEndBlocks',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'userInfo',
                outputs: [
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                  { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'withdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ]
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
            const stakedAmount = await contract.methods.userInfo(address).call()
            const userStaked = await stakedAmount[0]
            const parsedBal = parseFloat(userStaked)

            setStaked(parsedBal)
          } else if (pool.poolCategory === 'Core') {
            const abi = [
              { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
              {
                anonymous: false,
                inputs: [
                  { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'AdminTokenRecovery',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Deposit',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'EmergencyWithdraw',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
                name: 'NewPoolLimit',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
                name: 'NewRewardPerBlock',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
                  { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
                ],
                name: 'NewStartAndEndBlocks',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
                  { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
                ],
                name: 'OwnershipTransferred',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [{ indexed: false, internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
                name: 'RewardsStop',
                type: 'event',
              },
              {
                anonymous: false,
                inputs: [
                  { indexed: true, internalType: 'address', name: 'user', type: 'address' },
                  { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
                ],
                name: 'Withdraw',
                type: 'event',
              },
              {
                inputs: [],
                name: 'PRECISION_FACTOR',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'SMART_CHEF_FACTORY',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'accTokenPerShare',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'bonusEndBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'deposit',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'emergencyRewardWithdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [],
                name: 'hasUserLimit',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
                  { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
                  { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
                  { internalType: 'address', name: '_admin', type: 'address' },
                ],
                name: 'initialize',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [],
                name: 'isInitialized',
                outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'lastRewardBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'owner',
                outputs: [{ internalType: 'address', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
                name: 'pendingReward',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'poolLimitPerUser',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'address', name: '_tokenAddress', type: 'address' },
                  { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
                ],
                name: 'recoverWrongTokens',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [],
                name: 'rewardPerBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'rewardToken',
                outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'stakedToken',
                outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [],
                name: 'startBlock',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function',
              },
              { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
              {
                inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
                name: 'transferOwnership',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
                  { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
                ],
                name: 'updatePoolLimitPerUser',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
                name: 'updateRewardPerBlock',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [
                  { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
                  { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
                ],
                name: 'updateStartAndEndBlocks',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'address', name: '', type: 'address' }],
                name: 'userInfo',
                outputs: [
                  { internalType: 'uint256', name: 'amount', type: 'uint256' },
                  { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
                ],
                stateMutability: 'view',
                type: 'function',
              },
              {
                inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
                name: 'withdraw',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ]
            const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
            const stakedAmount = await contract.methods.userInfo(address).call()
            const userStaked = await stakedAmount[0]
            const parsedBal = parseFloat(userStaked)

            setStaked(parsedBal)
          }
        } catch (error) {
          // console.log(error, 'getStakingBalance')
        }
      }
    })
  }

  useEffect(() => {
    getStakingBalance(account)
    return () => {
      setStaked(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  // console.log(openPools, 'open pools')

  const getUserInfo = async (pool, address) => {
    try {
      if (pool.poolCategory === '30DayLock' || pool.poolCategory === '60DayLock' || pool.poolCategory === '90DayLock') {
        const abi = [
          { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'AdminTokenRecovery',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'ClaimReward',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Deposit',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'EmergencyWithdraw',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
            name: 'NewPoolLimit',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
            name: 'NewRewardPerBlock',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
            ],
            name: 'NewStartAndEndBlocks',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Withdraw',
            type: 'event',
          },
          {
            inputs: [],
            name: 'PRECISION_FACTOR',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'SMART_CHEF_FACTORY',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'accTokenPerShare',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'addressEndLockTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'bonusEndBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          { inputs: [], name: 'claimReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'emergencyRewardWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [],
            name: 'endLockTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
            name: 'getRemainingLockTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'hasAllRewardDistributedByAdmin',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'hasSavedPendingRewardUpdatedByAdmin',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'hasUserLimit',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
              { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
              { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_lockTime', type: 'uint256' },
              { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
              { internalType: 'address', name: '_admin', type: 'address' },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'isInitialized',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'lastRewardBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'lockTime',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'numberOfClaimCurrentAndTotalPendingReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'numberOfClaimSavedPendingReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
            name: 'pendingReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'poolLimitPerUser',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_tokenAddress', type: 'address' },
              { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
            ],
            name: 'recoverWrongTokens',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [],
            name: 'rewardPerBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'rewardToken',
            outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'stakedToken',
            outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'startBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'temporaryPendingReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
              { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
            ],
            name: 'updatePoolLimitPerUser',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
            name: 'updateRewardPerBlock',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
            ],
            name: 'updateStartAndEndBlocks',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'userInfo',
            outputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'withdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const userInfo = await contract.methods.userInfo(address).call()
        console.log(pool, 'pool')
        console.log(userInfo, 'user')

        // console.log(parsedBal, 'staked')
        setUserDetails(userInfo)
      } else if (pool.poolCategory === 'Core') {
        const abi = [
          { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'address', name: 'tokenRecovered', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'AdminTokenRecovery',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Deposit',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'EmergencyWithdraw',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [{ indexed: false, internalType: 'uint256', name: 'poolLimitPerUser', type: 'uint256' }],
            name: 'NewPoolLimit',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [{ indexed: false, internalType: 'uint256', name: 'rewardPerBlock', type: 'uint256' }],
            name: 'NewRewardPerBlock',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: false, internalType: 'uint256', name: 'startBlock', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'endBlock', type: 'uint256' },
            ],
            name: 'NewStartAndEndBlocks',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
            ],
            name: 'OwnershipTransferred',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [{ indexed: false, internalType: 'uint256', name: 'blockNumber', type: 'uint256' }],
            name: 'RewardsStop',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'user', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'Withdraw',
            type: 'event',
          },
          {
            inputs: [],
            name: 'PRECISION_FACTOR',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'SMART_CHEF_FACTORY',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'accTokenPerShare',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'bonusEndBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'deposit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'emergencyRewardWithdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          { inputs: [], name: 'emergencyWithdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [],
            name: 'hasUserLimit',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'contract IBEP20', name: '_stakedToken', type: 'address' },
              { internalType: 'contract IBEP20', name: '_rewardToken', type: 'address' },
              { internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
              { internalType: 'address', name: '_admin', type: 'address' },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'isInitialized',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'lastRewardBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'owner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
            name: 'pendingReward',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'poolLimitPerUser',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_tokenAddress', type: 'address' },
              { internalType: 'uint256', name: '_tokenAmount', type: 'uint256' },
            ],
            name: 'recoverWrongTokens',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [],
            name: 'rewardPerBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'rewardToken',
            outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'stakedToken',
            outputs: [{ internalType: 'contract IBEP20', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'startBlock',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          { inputs: [], name: 'stopReward', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'bool', name: '_hasUserLimit', type: 'bool' },
              { internalType: 'uint256', name: '_poolLimitPerUser', type: 'uint256' },
            ],
            name: 'updatePoolLimitPerUser',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_rewardPerBlock', type: 'uint256' }],
            name: 'updateRewardPerBlock',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'uint256', name: '_startBlock', type: 'uint256' },
              { internalType: 'uint256', name: '_bonusEndBlock', type: 'uint256' },
            ],
            name: 'updateStartAndEndBlocks',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'userInfo',
            outputs: [
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
              { internalType: 'uint256', name: 'rewardDebt', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
            name: 'withdraw',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
        const userInfo = await contract.methods.userInfo(address).call()
        console.log(pool, 'pool')
        console.log(userInfo, 'user')
        // console.log(parsedBal, 'staked')

        setUserDetails(userInfo)
      }
    } catch (error) {
      console.log(error, 'getUserInfo')
    }
  }

  // useEffect(() => {
  //   pools.map((pool) => getUserInfo(pool, account))
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [account])

  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isFinished) {
          return userDetails && userDetails[0] === '0'
        }
        return userDetails && parseInt(userDetails[0]) > 0
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [finishedPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () => openPools.filter((pool) => staked && staked > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [openPools],
  )

  // console.log(stakedOnlyFinishedPools, 'stakedOnlyFinishedPools')

  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  // This pool is passed explicitly to the cake vault
  const cakePoolData = useMemo(() => openPools.find((pool) => pool.sousId === 0), [openPools])

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  return (
    <div style={{ paddingTop: '1.85rem' }} className="farm_heading">
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, 'row']}>
          <Flex flexDirection="column" mr={['8px', 0]}>
            <Heading
              as="h1"
              color="white"
              mb="20px"
              style={{ fontSize: '3.25rem', marginBottom: '12px', textAlign: 'center' }}
            >
              {t('Staking Pools')}
            </Heading>
            <Heading scale="lg" color="white" style={{ opacity: '0.65', fontSize: '1.25rem', textAlign: 'center' }}>
              {t('Just stake some tokens to earn.')}
            </Heading>
            <Heading
              scale="lg"
              color="white"
              style={{ opacity: '0.65', fontSize: '1.25rem', textAlign: 'center', marginBottom: '15px' }}
            >
              {t('High APR, low risk.')}
            </Heading>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '16px',
                fontWeight: 'bolder',
              }}
            >
              {/* eslint-disable-next-line */}
              <p style={{ color: '#04bbfb', fontSize: '16px', cursor: 'pointer' }} onClick={() => setOpen(true)}>
                How to stake?
              </p>
            </div>
          </Flex>
          {/* <Flex height="fit-content" justifyContent="center" alignItems="center" mt={['24px', null, '0']}>
            <BountyCard />
          </Flex> */}
        </Flex>
      </PageHeader>
      <Page>
        <PoolTabButtons
          stakedOnly={stakedOnly}
          setStakedOnly={setStakedOnly}
          hasStakeInFinishedPools={hasStakeInFinishedPools}
        />
        <div className="modal_video">
          <ModalVideo channel="youtube" autoplay isOpen={isOpen} videoId="iricuuB4KUo" onClose={() => setOpen(false)} />
        </div>
        <FlexLayout>
          <Route exact strict path={`${path}`}>
            <>
              {/* <CakeVaultCard pool={cakePoolData} showStakedOnly={stakedOnly} /> */}
              {stakedOnly
                ? orderBy(stakedOnlyOpenPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
                : orderBy(openPools, ['sortOrder'])
                    .slice(0, numberOfPoolsVisible)
                    .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
            </>
          </Route>
          <Route exact strict path={`${path}history`}>
            {stakedOnly
              ? orderBy(stakedOnlyFinishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)
              : orderBy(finishedPools, ['sortOrder'])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => <PoolCard key={pool.sousId} pool={pool} account={account} />)}
          </Route>
        </FlexLayout>
        <div ref={loadMoreRef} />
        {/* <Image
          mx="auto"
          mt="12px"
          src="/images/3d-syrup-bunnies.png"
          alt="Pancake illustration"
          width={192}
          height={184.5}
        /> */}
      </Page>
    </div>
  )
}

export default Pools
