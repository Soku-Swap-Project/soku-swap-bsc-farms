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

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningsDollarValue}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isCompoundPool}
      pool={pool}
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
