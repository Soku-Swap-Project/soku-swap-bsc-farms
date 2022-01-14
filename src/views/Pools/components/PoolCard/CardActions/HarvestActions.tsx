import React from 'react'
import { Flex, Text, Button, Heading, useModal, Skeleton } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { Token } from 'config/constants/types'
import { Pool } from 'state/types'
import { getWeb3NoAccount } from 'utils/web3'
import { useWeb3React } from '@web3-react/core'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from 'utils/formatBalance'
import { useBusdPriceFromToken, useTokenPrice, usePriceBnbSuteku } from 'state/hooks'
import Balance from 'components/Balance'
import CollectModal from '../Modals/CollectModal'

/* eslint-disable react/require-default-props */
interface HarvestActionsProps {
  pool: Pool
  earnings: BigNumber
  earningToken: Token
  sousId: number
  isBnbPool: boolean
  isLoading?: boolean
}

const HarvestActions: React.FC<HarvestActionsProps> = ({
  earnings,
  earningToken,
  sousId,
  isBnbPool,
  pool,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const web3 = getWeb3NoAccount()
  const { account } = useWeb3React()

  // let earningTokenPrice;

  // const earningTokenPrice = useBusdPriceFromToken(earningToken.symbol)
  const bnbPrice = useTokenPrice('wbnb')
  const bnbPriceBig = new BigNumber(bnbPrice)
  const sokuPrice = useTokenPrice('sokuswap')
  const sutekuPrice = usePriceBnbSuteku()

  // if (earningToken.symbol === 'SOKU') {
  //   const earningTokenPrice =
  // }
  const earningTokenPrice = earningToken.symbol === 'SOKU' ? sokuPrice : sutekuPrice.toNumber()
  // const earningTokenPrice = new BigNumber(1)

  // console.log(earningTokenPrice)

  const earningTokenPriceAsNumber = earningTokenPrice
  // console.log(earningTokenPriceAsNumber)

  const earningTokenDollarBalance = getBalanceNumber(
    earnings.multipliedBy(earningTokenPriceAsNumber),
    earningToken.decimals,
  )
  const earningsDollarValue = formatNumber(earningTokenDollarBalance)

  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const hasEarnings = earnings.toNumber() > 0
  const isCompoundPool = sousId === 0

  const claimRewards = async () => {
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
        name: 'ClaimRewards',
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
      {
        inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
        name: 'claimRewards',
        outputs: [],
        stateMutability: 'nonpayable',
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

    if (pool.poolCategory === 'Lock') {
      const contract = new web3.eth.Contract(abi as unknown as AbiItem, getAddress(pool.contractAddress))
      await contract.methods
        .claimRewards(earnings.toNumber())
        .send({ from: account })
        .then((receipt) => {
          console.log(receipt)
        })
    }
  }

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
    />,
  )

  return (
    <Flex flexDirection="column" mb="16px">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          {isLoading ? (
            <Skeleton width="80px" height="48px" />
          ) : (
            <>
              {hasEarnings ? (
                <Balance bold fontSize="20px" decimals={3} value={earningTokenBalance} />
              ) : (
                <Heading color="textDisabled">0</Heading>
              )}
              {earningTokenPriceAsNumber && (
                <Text fontSize="12px" color={hasEarnings ? 'textSubtle' : 'textDisabled'}>
                  {hasEarnings ? (
                    <Balance
                      display="inline"
                      fontSize="12px"
                      color="rgb(4, 187, 251)"
                      decimals={2}
                      value={earningTokenDollarBalance}
                      unit=" USD"
                    />
                  ) : (
                    '0 USD'
                  )}
                </Text>
              )}
            </>
          )}
        </Flex>
        <Flex>
          <Button style={{ background: 'rgb(4, 187, 251)' }} disabled={!hasEarnings} onClick={onPresentCollect}>
            {isCompoundPool ? t('Collect') : t('Claim')}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default HarvestActions
