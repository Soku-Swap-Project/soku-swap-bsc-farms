/* eslint-disable */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceApiThunk, PriceState } from 'state/types'
import BigNumber from 'bignumber.js'
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import { useTokenPrice } from '../hooks'
import axios from 'axios'

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

const CoinGecko = require('coingecko-api')

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko()

let earnable_price
let soku_price
let yummy_price

//3. Make calls
const getEarnablePrice = async () => {
  const res = await CoinGeckoClient.coins.fetch('earnable')
  const data = await res.data
  const unformatted_price = new BigNumber(data.market_data.current_price.usd).toString()
  const formatted_price = parseFloat(unformatted_price).toLocaleString(undefined, {
    minimumSignificantDigits: 3,
  })
  earnable_price = formatted_price
}

const getTasteYUMMYPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0xB003C68917BaB76812797d1b8056822f48E2e4fe`,
    )
    yummy_price = data.data.price
  } catch (error) {
    console.log('kevin getYummyPice error ==>', error)
  }
}

const getSokuPrice = async () => {
  try {
    const { data } = await axios.get(
      `https://api.pancakeswap.info/api/v2/tokens/0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53`,
    )
    soku_price = data.data.price
  } catch (error) {
    console.log('kevin getYummyPice error ==>', error)
  }
}

getEarnablePrice()
getTasteYUMMYPrice()
getSokuPrice()

export const bnbPrice = () => {
  const price = useTokenPrice('binance-coin')
  return price
}

export const sokuPrice = () => {
  const price = useTokenPrice('sokuswap')
  return price
}

export const getPrices = async () => {
  const res = await CoinGeckoClient.coins.markets({ ids: ['bitcoin', 'sokuswap', 'binancecoin', 'tether'] })
  const resArray = JSON.stringify(res.data)
  console.log('test', resArray)
}

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiThunk>('prices/fetch', async () => {
  const response = await fetch('https://api.pancakeswap.info/api/v2/tokens')
  const data = (await response.json()) as PriceApiResponse

  const earn = {
    '0x11ba78277d800502c84c5aed1374ff0a91f19f7e': {
      name: 'Earnable',
      symbol: 'EARN',
      price: earnable_price || NaN,
      price_BNB: earnable_price || NaN,
    },
  }

  const soku = {
    '0x0e4b5ea0259eb3d66e6fcb7cc8785817f8490a53': {
      name: 'Soku',
      symbol: 'SOKU',
      price: soku_price || NaN,
      price_BNB: soku_price || NaN,
    },
  }

  const yummy = {
    '0xB003C68917BaB76812797d1b8056822f48E2e4fe': {
      name: 'YUMMY',
      symbol: 'YUMMY',
      price: yummy_price || NaN,
      price_BNB: yummy_price || NaN,
    },
  }

  Object.assign(data.data, earn)
  Object.assign(data.data, soku)
  Object.assign(data.data, yummy)

  // console.log(data.data)

  // Return normalized token names
  return {
    updated_at: data.updated_at,
    data: Object.keys(data.data).reduce((accum, token) => {
      // console.log(token)
      return {
        ...accum,
        [token.toLowerCase()]: parseFloat(data.data[token].price),
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiThunk>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.updated_at
      state.data = action.payload.data
    })
  },
})

export default pricesSlice.reducer
