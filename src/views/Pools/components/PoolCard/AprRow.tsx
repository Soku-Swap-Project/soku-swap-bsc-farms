import React, { useState, useEffect } from 'react'
import { Flex, TooltipText, IconButton, useModal, CalculateIcon, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolApr } from 'utils/apr'
import { AbiItem } from 'web3-utils'
import { tokenEarnedPerThousandDollarsCompounding, getRoi } from 'utils/compoundApyHelpers'
import { useBusdPriceFromToken, useTokenPrice, usePriceBnbSuteku } from 'state/hooks'
import Balance from 'components/Balance'
import ApyCalculatorModal from 'components/ApyCalculatorModal'
import AprCalculatorModal from 'components/AprCalculatorModal'
import { Pool } from 'state/types'
import { BASE_EXCHANGE_URL } from 'config'
import BigNumber from 'bignumber.js'
import { getWeb3NoAccount } from 'utils/web3'
import { getAddress } from 'utils/addressHelpers'

/* eslint-disable react/require-default-props */
interface AprRowProps {
  pool: Pool
  isAutoVault?: boolean
  compoundFrequency?: number
  performanceFee?: number
}

const AprRow: React.FC<AprRowProps> = ({ pool, isAutoVault = false, compoundFrequency = 1, performanceFee = 0 }) => {
  const { t } = useTranslation()
  const { stakingToken, earningToken, totalStaked, isFinished, tokenPerBlock } = pool
  const web3 = getWeb3NoAccount()
  const [rewardPerBlock, setRewardPerBlock] = useState('')

  const getRewardPerBlock = async () => {
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
    // console.log('reward contract', contract)

    const rpb = await contract.methods.rewardPerBlock().call()
    setRewardPerBlock(web3.utils.fromWei(rpb))
  }

  useEffect(() => {
    getRewardPerBlock()
  })

  const tooltipContent = isAutoVault
    ? t('APY includes compounding, APR doesn’t. This pool’s SOKU is compounded automatically, so we show APY.')
    : t('This pool’s rewards aren’t compounded automatically, so we show APR')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  const sokuPrice = useTokenPrice('sokuswap')
  const sutekuPrice = usePriceBnbSuteku()
  const earningTokenPrice = earningToken.symbol === 'SOKU' ? sokuPrice : sutekuPrice.toNumber()
  const earningTokenPriceAsNumber = earningTokenPrice

  const stakingTokenPrice = stakingToken.symbol === 'SOKU' ? sokuPrice : sutekuPrice.toNumber()
  const stakingTokenPriceAsNumber = stakingTokenPrice

  const apr =
    getPoolApr(
      stakingTokenPriceAsNumber,
      earningTokenPriceAsNumber,
      getBalanceNumber(totalStaked, stakingToken.decimals),
      parseFloat(rewardPerBlock),
    ) * 0.75

  // special handling for tokens like tBTC or BIFI where the daily token rewards for $1000 dollars will be less than 0.001 of that token
  const isHighValueToken = Math.round(earningTokenPriceAsNumber / 1000) > 0
  const roundingDecimals = isHighValueToken ? 4 : 2

  const earningsPercentageToDisplay = () => {
    if (isAutoVault) {
      const oneThousandDollarsWorthOfToken = 1000 / earningTokenPriceAsNumber
      const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
        numberOfDays: 365,
        farmApr: apr,
        tokenPrice: earningTokenPriceAsNumber,
        roundingDecimals,
        compoundFrequency,
        performanceFee,
      })
      return getRoi({
        amountEarned: tokenEarnedPerThousand365D,
        amountInvested: oneThousandDollarsWorthOfToken,
      })
    }
    return apr
  }

  const apyModalLink = stakingToken.address && `${BASE_EXCHANGE_URL}/#/swap?outputCurrency=${stakingToken.address[56]}`

  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      tokenPrice={earningTokenPriceAsNumber}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={isHighValueToken ? 4 : 2}
      compoundFrequency={compoundFrequency}
      performanceFee={performanceFee}
    />,
  )

  const [onPresentAprModal] = useModal(
    <AprCalculatorModal
      tokenPrice={earningTokenPriceAsNumber}
      apr={apr}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink || BASE_EXCHANGE_URL}
      earningTokenSymbol={earningToken.symbol}
      roundingDecimals={isHighValueToken ? 4 : 2}
      performanceFee={performanceFee}
    />,
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{isAutoVault ? `${t('APY')}:` : `${t('APR')}:`}</TooltipText>
      {isFinished || !apr ? (
        <Skeleton width="82px" height="32px" />
      ) : (
        <Flex alignItems="center">
          <Balance
            fontSize="16px"
            isDisabled={isFinished}
            value={earningsPercentageToDisplay()}
            decimals={2}
            unit="%"
            bold
          />
          <IconButton
            onClick={pool.poolCategory === 'Lock' ? onPresentAprModal : onPresentApyModal}
            variant="text"
            scale="sm"
          >
            <CalculateIcon color="textSubtle" width="18px" />
          </IconButton>
        </Flex>
      )}
    </Flex>
  )
}

export default AprRow
