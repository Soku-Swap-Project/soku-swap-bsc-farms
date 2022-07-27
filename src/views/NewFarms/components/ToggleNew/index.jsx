import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

/* eslint-disable */

const StyledButtonMenu = styled(ButtonMenu)`
  border: none;
  background: transparent;
`
const ToggleNew = () => {
  const { isExact } = useRouteMatch()
  const pathname = window.location.pathname
  const newUrl = pathname.replace(/\/?$/, '/')

  const isActive = pathname === newUrl
  return (
    <Wrapper>
      <StyledButtonMenu activeIndex={isExact ? 1 : 0} scale="sm" variant="primary">
        <ButtonMenuItem
          className={isExact ? 'hover_shadow' : 'emphasized-selected hover_shadow'}
          style={{ color: '#05195a', marginRight: '14px', borderRadius: '14px' }}
          as={Link}
          to={`${'/bsc/farms'}`}
        >
          Farm V1
        </ButtonMenuItem>
        <ButtonMenuItem
          className={isExact ? 'emphasized-selected hover_shadow' : 'hover_shadow'}
          style={{ color: '#05195a', borderRadius: '14px' }}
          as={Link}
          to={`/bsc/farms-v2/`}
        >
          Farm V2
        </ButtonMenuItem>
      </StyledButtonMenu>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 20px;
`

export default ToggleNew
