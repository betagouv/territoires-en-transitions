import type { ActionStatus } from './actionStatus'
import type { Indicator } from './indicator'
import type {CustomMesure} from "./customMesure";

/**
 * Structure of all data of the current user in localStorage
 */
export interface Store {
  action_statuses?: {
    [key: string]: ActionStatus
  },
  indicators?: {
    [key: string]: Indicator
  },
  customMesures?: Record<string, CustomMesure>
}

export const storeKey = 'territoiresentransitions'

/**
 * Get all data of the current user from localStorage
 */
export const getStore = (): Store => {
  const storeJson = localStorage.getItem(storeKey) || '{}'

  return JSON.parse(storeJson)
}

/**
 * Set all data of the current user in localStorage
 */
export const setStore = (newStore: Store): Store => {
  localStorage.setItem(storeKey, JSON.stringify(newStore))

  return newStore
}