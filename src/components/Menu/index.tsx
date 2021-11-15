/* eslint-disable */
import React from 'react'
import { Menu as UikitMenu, useWalletModal } from '@pancakeswap/uikit'
import { NavLink } from 'react-router-dom'

import { useWeb3React } from '@web3-react/core'
import { languageList } from 'config/localization/languages'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd, useProfile } from 'state/hooks'
import config from './config'
import ClaimSokuModal from 'components/ClaimSokuModal'
import AccountModal from 'components/AccountModal'

import './Menu.css'

const Menu = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { profile } = useProfile()
  const { currentLanguage, setLanguage, t } = useTranslation()

  const { onPresentConnectModal } = useWalletModal(login, logout)

  const truncatedFirstHalf = account?.substring(0, 5)
  const truncatedLastHalf = account?.substring(account.length - 5, account.length)
  const truncatedAddress = `${truncatedFirstHalf}...${truncatedLastHalf}`

  const openHiddenLinks = () => {
    const hiddenLinks = document.getElementsByClassName('hidden_navLinks')
    // console.log(hiddenLinks)
    if (hiddenLinks[0]?.id === 'hidden_navLinks') {
      hiddenLinks[0].id = 'open'
    } else if (hiddenLinks[0]?.id === 'open') {
      hiddenLinks[0].id = 'hidden_navLinks'
    }
  }

  const isMobile = window.innerWidth <= 500

  return (
    <>
      <div className="sokuswap__navbar">
        <nav>
          <ul className="navbar__items">
            <a className="nav_link" href="/bsc/#/swap">
              <img className="nav_logo" style={{ height: '50px' }} alt="Logo" src="images/Web-Corner-Logo.png" />
            </a>
            <div className="navbar__options">
              <a className="nav_link" href="/bsc/#/swap">
                <li>Swap</li>
              </a>
              {isMobile ? (
                <a className="nav_link" href="/bsc/#/limit-order">
                  <li>Limit</li>
                </a>
              ) : (
                <a className="nav_link" href="/bsc/#/limit-order">
                  <li>Limit Orders</li>
                </a>
              )}
              <a className="nav_link" href="/bsc/#/pool">
                <li>Pool</li>
              </a>
              <a className="nav_link" href="https://www.binance.org/en/bridge">
                <li>Bridge</li>
              </a>
              <NavLink className="nav_link" activeClassName="active" to="/bsc/farms/v2">
                <li>Farms</li>
              </NavLink>
              <NavLink className="nav_link" activeClassName="active" to="/bsc/staking/">
                <li>Staking</li>
              </NavLink>
            </div>
          </ul>
          <ul className="connectWallet__options__DESKTOP">
            {account ? (
              <AccountModal />
            ) : (
              <li className="connectWallet__nav">
                <button type="button" onClick={onPresentConnectModal}>
                  Connect Wallet
                </button>
              </li>
            )}

            <li className="claimSoku__nav">
              <ClaimSokuModal />
            </li>
            <li>
              <button type="button" className="material-icons" onClick={openHiddenLinks}>
                more_horiz
              </button>
            </li>
          </ul>
          <ul className="hidden_navLinks" id="hidden_navLinks">
            <li className="hidden_navLink">
              <a href="https://www.sokuswap.finance/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">info</span>
                <p>About</p>
              </a>
            </li>
            <li className="hidden_navLink">
              <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">code</span>
                <p>Code</p>
              </a>
            </li>
            <li className="hidden_navLink">
              <a
                href="https://sokuswap-1.gitbook.io/sokuswap-whitepaper/"
                rel="noreferrer noopener"
                className="disabled_link"
                target="_blank"
              >
                <span className="material-icons">school</span>
                <p>Docs</p>
              </a>
            </li>
            <li className="hidden_navLink">
              <a href="/" rel="noreferrer noopener" className="disabled_link" target="_blank">
                <span className="material-icons">analytics</span>
                <p>Analytics</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* <UikitMenu
        account={null}
        login={null}
        logout={null}
        isDark={null}
        toggleTheme={null}
        currentLang={currentLanguage.code}
        langs={languageList}
        setLang={setLanguage}
        cakePriceUsd={cakePriceUsd.toNumber()}
        links={}
        profile={{
          username: profile?.username,
          image: profile?.nft ? `/images/nfts/${profile.nft?.images.sm}` : undefined,
          profileLink: '/profile',
          noProfileLink: '/profile',
          showPip: !profile?.username,
        }}
        {...props}
      /> */}
    </>
  )
}

export default Menu
