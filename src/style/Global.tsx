import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PancakeTheme } from '@pancakeswap/uikit/dist/theme'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PancakeTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
  }

  body {
    min-height: 100vh;
    background: linear-gradient(250deg, #05195a 20%, #040f31);


    img {
      height: auto;
      max-width: 100%;
    }
  }

  svg[color="primary"] {
    color: #04bbfb;
    fill: #04bbfb;
  }

  button {
    box-shadow: none !important;
  }

  svg[color="textSubtle"] {
    fill: #04bbfb;
    width: 18px;

  }
  #import-pool-link {
    color: #04bbfb;
  }

  div[color="#452A7A"] {
    color: #04bbfb;
  }

  svg[stroke="#8f80ba"] {
    stroke: #05195a;
    border: none;
  }

  div[color='textSubtle'] {
    color: #05489c;
  }
  

  div[color="text"], p[color="text"] {
    color: #05195a;
  }

  svg[stroke="#1FC7D4"] {
    stroke: #04bbfb;
  }

  a[color="primary"] {
    color: #05195a
  }

  div[id="pair"] {
    white-space: nowrap;
  }

  input[placeholder="Search by name, symbol, address"]:focus:not(:disabled) {
    box-shadow: none;
  }

  input[placeholder="Search by name, symbol, address"]::placeholder {
    color: #c9c9c9;
  }

  .add_remove_liquidity {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  @media (max-width: 600px) {
    .add_remove_liquidity {
      width: 100%;
      flex-direction: column;
    }

    .farm_liquidity_buttons.add {
      margin-bottom: 16px;
    }

  }

  .farm_liquidity_buttons {
    background: #05195a;
    border: none;
    padding: 0.75rem 1rem !important;
    border-radius: 24px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    margin: 0 7px;
  }

  .farm_liquidity_buttons:hover {
    opacity: 0.85;
    transition: opacity 0.2s
  }

  
  *:focus {
    outline: 0;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
* {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

  /* 'x' and Wallet names on Connect to a Wallet */
  button[id='wallet-connect-metamask'] div,
  button[id='wallet-connect-trustwallet'] div,
  button[id='wallet-connect-mathwallet'] div,
  button[id='wallet-connect-tokenpocket'] div,
  button[id='wallet-connect-walletconnect'] div,
  button[id='wallet-connect-binance chain wallet'] div,
  button[id='wallet-connect-safepal wallet'] div {
    color: #04bbfb !important;
    fill: #04bbfb !important;
    font-family: 'Poppins' !important;
  }
  
  a[href="https://docs.pancakeswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain"] {
    display: none;
  }

  // Tooltip
  div[data-popper-reference-hidden="false"][data-popper-escaped="false"][data-popper-placement="top-end"] {
    background: #fff;
    color: #04bbfb
  }

  div[data-popper-reference-hidden="false"][data-popper-escaped="false"][data-popper-placement="top-end"] div::before {
    background: #fff;
  }
  
  div[role='presentation'] {
    background: rgba(0, 0, 0, 0.603);
  }
  
  h2[color='text'] {
    color: #05195a;
    font-family: 'Poppins', 'sans';
  }
  
  svg[color='primary'] {
    color: #04bbfb;
    fill: #04bbfb;
  }
  
  div[color='textSubtle'] {
    color: #05489c;
  }
  
  svg[stroke='#8f80ba'] {
    stroke: #05195a;
    border: none;
  }
  
  .pancake-button--disabled {
    background: #d8d8d8 !important;
  }
`

export default GlobalStyle
