import React, { useState, useEffect } from 'react'
import { Flex, Text, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { useBusdPriceFromToken, useTokenPrice, usePriceBnbSuteku } from 'state/hooks'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'
import { BIG_TEN } from '../../../../../utils/bigNumber'

/* eslint-disable react/require-default-props */
interface StakeActionsProps {
  pool: Pool
  stakingTokenBalance: BigNumber
  stakedBalance: BigNumber
  isBnbPool: boolean
  isStaked: ConstrainBoolean
  isLoading?: boolean
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
}) => {
  const { stakingToken, stakingLimit, isFinished, userData, contractAddress } = pool
  const [staked, setStaked] = useState(0)
  const [lockTime, setLockTime] = useState()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const web3 = getWeb3NoAccount()
  const stakedTokenBalance = getBalanceNumber(new BigNumber(staked), stakingToken.decimals)
  // const stakingTokenPrice = useBusdPriceFromToken(stakingToken.symbol)
  const sokuPrice = useTokenPrice('sokuswap')
  const sutekuPrice = usePriceBnbSuteku()

  const getStakingBalance = async (address) => {
    try {
      if (pool.poolCategory === 'Lock') {
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
      } else {
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
      console.log('stake action', error)
    }
  }

  useEffect(() => {
    getStakingBalance(account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const getLockTime = async (address) => {
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
    if (pool.poolCategory === 'Lock') {
      const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(contractAddress))
      const remainingTime = await contract.methods.getRemainingLockTime(address).call()
      setLockTime(remainingTime)
    }
  }

  useEffect(() => {
    getLockTime(account)
  })

  const stakingTokenPrice = stakingToken.symbol === 'SOKU' ? sokuPrice : sutekuPrice.toNumber()

  const stakingTokenPriceAsNumber = stakingTokenPrice
  const stakedTokenDollarBalance = new BigNumber(staked * stakingTokenPrice).dividedBy(
    BIG_TEN.pow(stakingToken.decimals),
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPriceAsNumber}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPriceAsNumber}
      isRemovingStake
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this pool!'),
    { placement: 'bottom' },
  )

  // console.log(stakedTokenDollarBalance, 'stakedTokenDollarBalance')

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={4} value={stakedTokenBalance} />
            {stakingTokenPriceAsNumber !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={stakedTokenDollarBalance.toNumber()}
                  // prefix="~"
                  unit=" USD"
                />
              </Text>
            )}
          </>
        </Flex>
        <Flex>
          {/* Disable withdraw/unstake if there is still lock time */}
          {pool.poolCategory === 'Lock' && lockTime !== '0' ? (
            <IconButton variant="secondary" disabled={!false} onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="gray" width="14px" />
            </IconButton>
          ) : (
            <IconButton style={{ border: '2px solid #05195a' }} variant="secondary" onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="#05195a" width="14px" />
            </IconButton>
          )}

          {reachStakingLimit ? (
            <span ref={targetRef}>
              <IconButton style={{ border: '2px solid #05195a' }} variant="secondary" disabled>
                <AddIcon color="#05195a" width="14px" height="24px" />
              </IconButton>
            </span>
          ) : (
            <IconButton
              variant="secondary"
              style={isFinished ? { border: '0' } : { border: '2px solid #05195a' }}
              onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color={isFinished ? 'gray' : '#05195a'} width="24px" height="24px" />
            </IconButton>
          )}
        </Flex>
        {tooltipVisible && tooltip}
      </Flex>
    ) : (
      <Button
        style={{ backgroundColor: '#04bbfb' }}
        disabled={isFinished}
        onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
      >
        {t('Stake')}
      </Button>
    )
  }

  return <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
}

export default StakeAction
