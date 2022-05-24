import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import farmsReducer from './farms'
import farmsV2Reducer from './farmsV2'
import poolsReducer from './pools'
import pricesReducer from './prices'
import predictionsReducer from './predictions'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import blockReducer from './block'
import collectiblesReducer from './collectibles'
import farmsWithSmartChefReducer from './farmsWithSmartChef'

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    achievements: achievementsReducer,
    block: blockReducer,
    farms: farmsReducer,
    farmsV2: farmsV2Reducer,
    farmsWithSmartChef: farmsWithSmartChefReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    predictions: predictionsReducer,
    profile: profileReducer,
    teams: teamsReducer,
    collectibles: collectiblesReducer,
  },
})

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
