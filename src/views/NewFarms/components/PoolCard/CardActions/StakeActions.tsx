import React, { useState, useEffect } from 'react'
import { Flex, Text, Button, IconButton, AddIcon, MinusIcon, useModal, Skeleton, useTooltip } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { getAddress } from 'utils/addressHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { Pool } from 'state/types'
import { useBusdPriceFromToken, useTokenPrice, usePriceHobiBnb, useFarmWithSmartChefFromPid, useLpTokenPrice, useFarmFromPidV2, useLpTokenPriceV2 } from 'state/hooks'
import { getUserPoolData } from 'state/pools'

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
  lockTime?: any
}

const StakeAction: React.FC<StakeActionsProps> = ({
  pool,
  stakingTokenBalance,
  stakedBalance,
  isBnbPool,
  isStaked,
  isLoading = false,
  lockTime,
}) => {
  const { stakingToken, stakingLimit, isFinished, userData, contractAddress } = pool
  // const [lockTime, setLockTime] = useState()
  const [userInfo, setUserInfo] = useState({})
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const web3 = getWeb3NoAccount()
  // const newWeb3 = new Web3(Web3.givenProvider)
  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  // const stakingTokenPrice = useBusdPriceFromToken(stakingToken.symbol)
  const hobiSutekuFarm = useFarmFromPidV2(18)
  const hobiSutekuLPPrice = useLpTokenPriceV2(hobiSutekuFarm.lpSymbol)

  const hobiBnbFarm = useFarmFromPidV2(19)
  const hobiBnbLPPrice = useLpTokenPriceV2(hobiBnbFarm.lpSymbol)

  const stakingTokenPrice = stakingToken.symbol === 'Hobi-Suteku' ? hobiSutekuLPPrice : hobiBnbLPPrice


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const test = await getUserPoolData(account)
        setUserInfo(test)
      } catch (err) {
        console.log(err, 'err')
      }
    }
    fetchUserData()
  }, [account])
  
  const stakingTokenPriceAsNumber = stakingTokenPrice.toNumber()
  const stakingDollarBalance = new BigNumber(stakedBalance.toNumber() * stakingTokenPriceAsNumber).dividedBy(
    BIG_TEN.pow(stakingToken.decimals),
  )
  const tempStakingDollarBalance = stakedBalance.toNumber() * stakingTokenPriceAsNumber

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakedBalance={stakedBalance}
      stakingTokenPrice={stakingTokenPriceAsNumber}
    />,
  )

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakedBalance={stakedBalance}
      stakingTokenPrice={stakingTokenPriceAsNumber}
      isRemovingStake
    />,
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('You’ve already staked the maximum amount you can stake in this farm!'),
    { placement: 'bottom' },
  )

  // console.log(tempStakingDollarBalance, 'tempStakingDollarBalance')

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  const renderStakeAction = () => {
    return isStaked ? (
      <Flex justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <>
            <Balance bold fontSize="20px" decimals={4} value={stakedTokenBalance} />
            {/* {stakingTokenPriceAsNumber !== 0 && (
              <Text fontSize="12px" color="textSubtle">
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  value={tempStakingDollarBalance}
                  // prefix="~"
                  unit=" USD"
                />
              </Text>
            )} */}
          </>
        </Flex>
        <Flex>
          {/* Disable withdraw/unstake if there is still lock time */}
          {(pool.poolCategory === '30DayLock' && lockTime !== '0' && !pool.isFinished) ||
          (pool.poolCategory === '60DayLock' && lockTime !== '0' && !pool.isFinished) ||
          (pool.poolCategory === '90DayLock' && lockTime !== '0' && !pool.isFinished) ? (
            <IconButton
              variant="secondary"
              disabled={pool.isFinished ? false : !false}
              onClick={onPresentUnstake}
              mr="6px"
            >
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
