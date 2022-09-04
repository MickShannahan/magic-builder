import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"



class DecksService {

  async getDecks(query = '') {
    const res = await api.get('api/decks' + query)
    logger.log('Get decks', res.data)
    AppState.decks = res.data
  }

  async getDeckById(id) {
    const res = await api.get('api/decks/' + id)
    logger.log('Got 1 deck', res.data)
    AppState.activeDeck = res.data
  }

  async createDeck(body) {
    const res = await api.post('api/decks', body)
    logger.log('created deck', res.data)
    AppState.decks.push(res.data)
  }
}

export const decksService = new DecksService()
