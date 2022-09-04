import Axios from 'axios'
import { baseURL } from '../env'
export const api = Axios.create({
  baseURL,
  timeout: 8000
})

export const scryfall = Axios.create({
  baseURL: 'https://api.scryfall.com/',
  timeout: 8000
})
