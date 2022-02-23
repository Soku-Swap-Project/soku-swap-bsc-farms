import React from 'react'
import ReactDOM from 'react-dom'
import { MoralisProvider } from 'react-moralis'
import App from './App'
import Providers from './Providers'

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <MoralisProvider
        appId="dyZCUehXXgCqWeYktEJOCiJDrgkt4XSxGbt1BHC2"
        serverUrl="https://dg42kg9qv9zz.usemoralis.com:2053/server"
      >
        <App />
      </MoralisProvider>
    </Providers>
  </React.StrictMode>,
  document.getElementById('root'),
)
