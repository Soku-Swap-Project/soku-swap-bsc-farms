import BigNumber from 'bignumber.js'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { Flex, Text, Box } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PoolCategory } from 'config/constants/types'
import { AbiItem } from 'web3-utils'
import { getWeb3NoAccount } from 'utils/web3'
import { useWeb3React } from '@web3-react/core'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import ApprovalAction from './ApprovalAction'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

const InlineText = styled(Text)`
  display: inline;
`

interface CardActionsProps {
  pool: Pool
  stakedBalance: BigNumber
}

const CardActions: React.FC<CardActionsProps> = ({ pool, stakedBalance }) => {
  const { sousId, stakingToken, earningToken, harvest, poolCategory, userData } = pool

  // console.log(pool, 'pool')
  const [reward, setReward] = useState(new BigNumber(0))
  const [balance, setBalance] = useState(new BigNumber(0))
  const [isApproved, setIsVaultApproved] = useState(false)
  const web3 = getWeb3NoAccount()
  const { account } = useWeb3React()
  const [staked, setStaked] = useState(1)
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const { t } = useTranslation()
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  // const newStakingTokenBalance = stakingTokenBalance === new BigNumber(0) || NaN ? new BigNumber(5) : new BigNumber(5)
  // const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const needsApproval = !isApproved && !isBnbPool && !(staked > 0)
  const isStaked = staked > 0
  const isLoading = !userData

  // console.log(stakedBalance, 'stakedBalance')

  // console.log(stakingToken.address[56], 'staking Token')

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        if (stakingToken.address[56] === '0x0e4B5Ea0259eB3D66E6FCB7Cc8785817F8490a53') {
          const abi = [
            { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
              ],
              name: 'Approval',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
                { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
                { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
              ],
              name: 'DelegateChanged',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
                { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
              ],
              name: 'DelegateVotesChanged',
              type: 'event',
            },
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
              ],
              name: 'Transfer',
              type: 'event',
            },
            {
              inputs: [],
              name: 'DELEGATION_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'DOMAIN_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
              ],
              name: 'allowance',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: '', type: 'address' },
                { internalType: 'uint32', name: '', type: 'uint32' },
              ],
              name: 'checkpoints',
              outputs: [
                { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
                { internalType: 'uint256', name: 'votes', type: 'uint256' },
              ],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'decimals',
              outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
              ],
              name: 'decreaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
              name: 'delegate',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'delegatee', type: 'address' },
                { internalType: 'uint256', name: 'nonce', type: 'uint256' },
                { internalType: 'uint256', name: 'expiry', type: 'uint256' },
                { internalType: 'uint8', name: 'v', type: 'uint8' },
                { internalType: 'bytes32', name: 'r', type: 'bytes32' },
                { internalType: 'bytes32', name: 's', type: 'bytes32' },
              ],
              name: 'delegateBySig',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
              name: 'delegates',
              outputs: [{ internalType: 'address', name: '', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'getCurrentVotes',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'account', type: 'address' },
                { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
              ],
              name: 'getPriorVotes',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
              ],
              name: 'increaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'name',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: '', type: 'address' }],
              name: 'nonces',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: '', type: 'address' }],
              name: 'numCheckpoints',
              outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'symbol',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'totalSupply',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transfer',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'sender', type: 'address' },
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transferFrom',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ]
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
          const response = await contract.methods.allowance(account, getAddress(pool.contractAddress)).call()
          const currentAllowance = new BigNumber(response)
          setIsVaultApproved(currentAllowance.gt(0))
        } else {
          const abi = [
            {
              anonymous: false,
              inputs: [
                { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
                { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
              ],
              name: 'Approval',
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
                { indexed: true, internalType: 'address', name: 'from', type: 'address' },
                { indexed: true, internalType: 'address', name: 'to', type: 'address' },
                { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
              ],
              name: 'Transfer',
              type: 'event',
            },
            {
              inputs: [],
              name: 'DOMAIN_TYPEHASH',
              outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'owner', type: 'address' },
                { internalType: 'address', name: 'spender', type: 'address' },
              ],
              name: 'allowance',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'approve',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
              name: 'balanceOf',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'decimals',
              outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
              ],
              name: 'decreaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'getOwner',
              outputs: [{ internalType: 'address', name: '', type: 'address' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'spender', type: 'address' },
                { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
              ],
              name: 'increaseAllowance',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: '_to', type: 'address' },
                { internalType: 'uint256', name: '_amount', type: 'uint256' },
              ],
              name: 'mint',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
              name: 'mint',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [],
              name: 'name',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
            { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
            {
              inputs: [],
              name: 'symbol',
              outputs: [{ internalType: 'string', name: '', type: 'string' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [],
              name: 'totalSupply',
              outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
              stateMutability: 'view',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transfer',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [
                { internalType: 'address', name: 'sender', type: 'address' },
                { internalType: 'address', name: 'recipient', type: 'address' },
                { internalType: 'uint256', name: 'amount', type: 'uint256' },
              ],
              name: 'transferFrom',
              outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
              stateMutability: 'nonpayable',
              type: 'function',
            },
            {
              inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
              name: 'transferOwnership',
              outputs: [],
              stateMutability: 'nonpayable',
              type: 'function',
            },
          ]
          const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))

          const response = await contract.methods.allowance(account, getAddress(pool.contractAddress)).call()
          const currentAllowance = new BigNumber(response)
          setIsVaultApproved(currentAllowance.gt(0))
        }
      } catch (error) {
        setIsVaultApproved(false)
      }
    }

    checkApprovalStatus()
  })

  useEffect(() => {
    const getBalance = async (address) => {
      // If SUTEKU
      if (stakingToken.address[56] === '0x198800af50914004a9e9d19ca18c0b24587a50cf') {
        const abi = [
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Approval',
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
              { indexed: true, internalType: 'address', name: 'from', type: 'address' },
              { indexed: true, internalType: 'address', name: 'to', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
          },
          {
            inputs: [],
            name: 'DOMAIN_TYPEHASH',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'owner', type: 'address' },
              { internalType: 'address', name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
            ],
            name: 'decreaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'getOwner',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
            ],
            name: 'increaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '_to', type: 'address' },
              { internalType: 'uint256', name: '_amount', type: 'uint256' },
            ],
            name: 'mint',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
            name: 'mint',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'name',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
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
          { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
          {
            inputs: [],
            name: 'symbol',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalSupply',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'sender', type: 'address' },
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFrom',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
            name: 'transferOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
        const response = await contract.methods.balanceOf(address).call()
        const bal = new BigNumber(response)
        setBalance(bal)
      } else {
        // If SOKU
        const abi = [
          { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
              { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Approval',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'delegator', type: 'address' },
              { indexed: true, internalType: 'address', name: 'fromDelegate', type: 'address' },
              { indexed: true, internalType: 'address', name: 'toDelegate', type: 'address' },
            ],
            name: 'DelegateChanged',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'delegate', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'previousBalance', type: 'uint256' },
              { indexed: false, internalType: 'uint256', name: 'newBalance', type: 'uint256' },
            ],
            name: 'DelegateVotesChanged',
            type: 'event',
          },
          {
            anonymous: false,
            inputs: [
              { indexed: true, internalType: 'address', name: 'from', type: 'address' },
              { indexed: true, internalType: 'address', name: 'to', type: 'address' },
              { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            name: 'Transfer',
            type: 'event',
          },
          {
            inputs: [],
            name: 'DELEGATION_TYPEHASH',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'DOMAIN_TYPEHASH',
            outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'owner', type: 'address' },
              { internalType: 'address', name: 'spender', type: 'address' },
            ],
            name: 'allowance',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'approve',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: '', type: 'address' },
              { internalType: 'uint32', name: '', type: 'uint32' },
            ],
            name: 'checkpoints',
            outputs: [
              { internalType: 'uint32', name: 'fromBlock', type: 'uint32' },
              { internalType: 'uint256', name: 'votes', type: 'uint256' },
            ],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'decimals',
            outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
            ],
            name: 'decreaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'delegatee', type: 'address' }],
            name: 'delegate',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'delegatee', type: 'address' },
              { internalType: 'uint256', name: 'nonce', type: 'uint256' },
              { internalType: 'uint256', name: 'expiry', type: 'uint256' },
              { internalType: 'uint8', name: 'v', type: 'uint8' },
              { internalType: 'bytes32', name: 'r', type: 'bytes32' },
              { internalType: 'bytes32', name: 's', type: 'bytes32' },
            ],
            name: 'delegateBySig',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'delegator', type: 'address' }],
            name: 'delegates',
            outputs: [{ internalType: 'address', name: '', type: 'address' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
            name: 'getCurrentVotes',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'account', type: 'address' },
              { internalType: 'uint256', name: 'blockNumber', type: 'uint256' },
            ],
            name: 'getPriorVotes',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'spender', type: 'address' },
              { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
            ],
            name: 'increaseAllowance',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [],
            name: 'name',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'nonces',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'numCheckpoints',
            outputs: [{ internalType: 'uint32', name: '', type: 'uint32' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'symbol',
            outputs: [{ internalType: 'string', name: '', type: 'string' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [],
            name: 'totalSupply',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transfer',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
          {
            inputs: [
              { internalType: 'address', name: 'sender', type: 'address' },
              { internalType: 'address', name: 'recipient', type: 'address' },
              { internalType: 'uint256', name: 'amount', type: 'uint256' },
            ],
            name: 'transferFrom',
            outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ]
        const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(stakingToken.address))
        const response = await contract.methods.balanceOf(address).call()
        const bal = new BigNumber(response)

        setBalance(bal)
      }
    }

    getBalance(account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const getStakingBalance = async (address) => {
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

      // console.log(parsedBal, 'staked')
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
      // console.log(parsedBal, 'staked')

      setStaked(parsedBal)
    }
  }

  useEffect(() => {
    getStakingBalance(account)
  })

  // console.log(balance, 'balance')

  const getPendingReward = async (address) => {
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
      const penReward = await contract.methods.pendingReward(address).call()
      setReward(penReward)
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
      const penReward = await contract.methods.pendingReward(address).call()
      setReward(penReward)
    }
  }

  useEffect(() => {
    getPendingReward(account)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        {harvest && (
          <>
            <Box display="inline">
              <InlineText color="#04bbfb" textTransform="uppercase" bold fontSize="12px">
                {`${earningToken.symbol} `}
              </InlineText>
              <InlineText color="textSubtle" textTransform="uppercase" bold fontSize="12px">
                {t('Earned')}
              </InlineText>
            </Box>
            <HarvestActions
              earnings={reward}
              earningToken={earningToken}
              sousId={sousId}
              isBnbPool={isBnbPool}
              isLoading={isLoading}
              pool={pool}
            />
          </>
        )}
        <Box display="inline">
          <InlineText color={isStaked ? '#04bbfb' : 'textSubtle'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText color={isStaked ? 'textSubtle' : '#04bbfb'} textTransform="uppercase" bold fontSize="12px">
            {isStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {needsApproval ? (
          <ApprovalAction pool={pool} isLoading={isLoading} />
        ) : (
          <StakeActions
            isLoading={isLoading}
            pool={pool}
            stakingTokenBalance={balance}
            stakedBalance={new BigNumber(staked)}
            isBnbPool={isBnbPool}
            isStaked={isStaked}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default CardActions
