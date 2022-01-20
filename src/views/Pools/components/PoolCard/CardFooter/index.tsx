import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Flex, CardFooter, ExpandableLabel, HelpIcon, useTooltip, Text } from '@pancakeswap/uikit'
import { Pool } from 'state/types'
import { CompoundingPoolTag, ManualPoolTag, LockedTag } from 'components/Tags'
import ExpandedFooter from './ExpandedFooter'

/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */

interface FooterProps {
  pool: Pool
  account: string
  isAutoVault?: boolean
  totalCakeInVault?: BigNumber
}

const ExpandableButtonWrapper = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({ pool, account, isAutoVault = false }) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const manualTooltipText = t('You must claim and compound your earnings from this pool manually.')
  const lockedVaultToolTip = t(
    'Higher payouts than Manual staking pools, however your tokens will be locked for a period of time.',
  )
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically claimed and restaked (compounded) for you.',
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    pool.poolCategory === 'Core' ? manualTooltipText : lockedVaultToolTip,
    {
      placement: 'bottom',
    },
  )

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <Flex alignItems="center">
          {pool.poolCategory === 'Core' ? <ManualPoolTag /> : <LockedTag />}
          {/* {isAutoVault ? <CompoundingPoolTag /> : <ManualPoolTag />} */}
          {tooltipVisible && tooltip}
          <Flex ref={targetRef}>
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>
        </Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <Text>Hide</Text> : <Text>Details</Text>}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && <ExpandedFooter pool={pool} account={account} isAutoVault={isAutoVault} />}
    </CardFooter>
  )
}

export default Footer
