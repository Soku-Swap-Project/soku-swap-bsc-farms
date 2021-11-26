import React, { lazy } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Router, Route, Switch } from 'react-router-dom'
import { ResetCSS, useWalletModal } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import {
  useFetchPriceList,
  // useFetchProfile, 
  useFetchPublicData
} from 'state/hooks'
import useAuth from 'hooks/useAuth'

import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import ToastListener from './components/ToastListener'
import PageLoader from './components/PageLoader'
import EasterEgg from './components/EasterEgg'
import Pools from './views/Pools'
import history from './routerHistory'
import AccountModal from './components/AccountModal'
import ClaimSokuModal from './components/ClaimSokuModal'
import SlideOutMenu from './components/SlideOutMenu/SlideOutMenu'
import ComingSoon from './views/ComingSoon'

import './MobileFooter.css'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
// const Home = lazy(() => import('./views/Home'))
// const Lottery = lazy(() => import('./views/Lottery'))
// const Ifos = lazy(() => import('./views/Ifos'))
// const Collectibles = lazy(() => import('./views/Collectibles'))
// const Teams = lazy(() => import('./views/Teams'))
// const Team = lazy(() => import('./views/Teams/Team'))
// const Profile = lazy(() => import('./views/Profile'))
// const TradingCompetition = lazy(() => import('./views/TradingCompetition'))
// const Predictions = lazy(() => import('./views/Predictions'))
const Farms = lazy(() => import('./views/Farms'))
const FarmsV2 = lazy(() => import('./views/FarmsV2'))
const NotFound = lazy(() => import('./views/NotFound'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  useEagerConnect()
  useFetchPublicData()
  // useFetchProfile()
  useFetchPriceList()

  const { account } = useWeb3React()
  const { login, logout } = useAuth()

  const { onPresentConnectModal } = useWalletModal(login, logout)

  const openHiddenLinks = () => {
    const hiddenLinks = document.getElementsByClassName('hidden_navLinksMobile')
    if (hiddenLinks[0]?.id === 'hidden_navLinks') {
      hiddenLinks[0].id = 'open'
    } else if (hiddenLinks[0]?.id === 'open') {
      hiddenLinks[0].id = 'hidden_navLinks'
    }
  }

  const isMobile = window.innerWidth <= 500

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      {isMobile ? <SlideOutMenu /> : <Menu />}
      {/* <Menu /> */}
      <SuspenseWithChunkError fallback={<PageLoader />}>
        <Switch>
          <Route exact path="/bsc/farms">
            <Farms />
          </Route>
          <Route exact strict path="/bsc/farms/v2">
            <FarmsV2 />
          </Route>
          <Route path="/bsc/staking/">
            <Pools />
          </Route>
          <Route path="/bsc/bridge/">
            <ComingSoon />
          </Route>
          <Route component={NotFound} />
        </Switch>
        <div className="connectWallet__options__MOBILE">
          <ul>
            {account ? (
              <li className="account__footer">
                <AccountModal />
              </li>
            ) : (
              <li className="connectWallet">
                <button type="button" onClick={onPresentConnectModal}>
                  Connect Wallet
                </button>
              </li>
            )}
            <li className="claimSoku">
              <ClaimSokuModal />
            </li>
            <li>
              <button type="submit" className="material-icons" onClick={openHiddenLinks}>
                more_horiz
              </button>
            </li>
          </ul>
          <ul className="hidden_navLinksMobile" id="hidden_navLinks">
            <li>
              <a href="https://www.sokuswap.finance/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">info</span>
                <p>About</p>
              </a>
            </li>
            <li>
              <a href="https://github.com/Soku-Swap-Project" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">code</span>
                <p>Code</p>
              </a>
            </li>
            <li>
              <a href="/" rel="noreferrer noopener" target="_blank">
                <span className="material-icons">analytics</span>
                <p>Analytics</p>
              </a>
            </li>
          </ul>
        </div>
      </SuspenseWithChunkError>
      <EasterEgg iterations={2} />
      <ToastListener />
    </Router>
  )
}

export default React.memo(App)
