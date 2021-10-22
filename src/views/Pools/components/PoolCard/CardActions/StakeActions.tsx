import React from 'react'
import { Flex, Text, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { useBusdPriceFromToken, useTokenPrice } from 'state/hooks'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../Modals/NotEnoughTokensModal'
import StakeModal from '../Modals/StakeModal'

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
  const { stakingToken, stakingLimit, isFinished, userData } = pool
  const { t } = useTranslation()
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  // const stakingTokenPrice = useBusdPriceFromToken(stakingToken.symbol)
  const stakingTokenPrice = useTokenPrice('sokuswap')

  // const stakingTokenPriceAsNumber = stakingTokenPrice ? stakingTokenPrice.toNumber() : 0
  const stakingTokenPriceAsNumber = stakingTokenPrice
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPriceAsNumber),
    stakingToken.decimals,
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

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
            {stakingTokenPriceAsNumber !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={stakedTokenDollarBalance}
                  // prefix="~"
                  unit=" USD"
                />
              </Text>
            )}
          </>
        </Flex>
        <Flex>
          <IconButton style={{ border: '2px solid #05195a' }} variant="secondary" onClick={onPresentUnstake} mr="6px">
            <MinusIcon color="#05195a" width="14px" />
          </IconButton>
          {reachStakingLimit ? (
            <span ref={targetRef}>
              <IconButton style={{ border: '2px solid #05195a' }} variant="secondary" disabled>
                <AddIcon color="#05195a" width="14px" height="24px" />
              </IconButton>
            </span>
          ) : (
            <IconButton
              variant="secondary"
              style={{ border: '2px solid #05195a' }}
              onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
              disabled={isFinished}
            >
              <AddIcon color="#05195a" width="24px" height="24px" />
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
