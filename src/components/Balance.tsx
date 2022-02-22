import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { Text, TextProps } from '@pancakeswap/uikit'

/* eslint-disable react/require-default-props */

interface BalanceProps extends TextProps {
  value: number
  decimals?: number
  unit?: string
  isDisabled?: boolean
  prefix?: string
}

const Balance: React.FC<BalanceProps> = ({
  value,
  color = 'text',
  decimals = 3,
  isDisabled = false,
  unit,
  prefix,
  ...props
}) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  const showPrefix = Boolean(value && prefix)
  const showUnit = Boolean(value && unit)

  // console.log(unit)

  return (
    <Text style={{ color: '#05195a' }} color={isDisabled ? 'textDisabled' : '#05195a'} {...props}>
      {showPrefix && <span>{prefix}</span>}
      <CountUp
        start={parseFloat(previousValue.current.toString())}
        end={parseFloat(value.toString())}
        decimals={decimals}
        duration={1}
        separator=","
      />
      {showUnit && <span>{unit}</span>}
    </Text>
  )
}

export default Balance
