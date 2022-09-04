import { AppState } from "../AppState.js"
import { Card } from "../models/Card.js"
import { logger } from "../utils/Logger.js"
import { formatSFURL } from "../utils/ScryfallURL.js"
import { api, scryfall } from "./AxiosService.js"




class CardsService {

  async searchScry(term, options) {
    const res = await scryfall.get('cards/search?' + formatSFURL(term, options))
    logger.log('SF results', res.data)
    AppState.cards = res.data.data.map(c => new Card(c))
  }

  async getCards(query = '') {
    const res = await api.get('api/cards' + query)
    logger.log('got profile cards', res.data)
    AppState.cards = res.data.map(c => new Card(c))
  }

  async addToCollection(card) {
    const res = await api.post('api/cards', card)
    logger.log('added to collection', res.data)
    return
  }

  async addToDeck(card) {
    const res = await api.post('api/deckcards', card)
    logger.log('added to deck', res.data)
    let existing = AppState.activeDeck.cards?.find(dc => dc.id == res.data.id)
    if (existing) {
      existing.count = res.data.count
    } else {
      AppState.activeDeck.cards.push(res.data)
    }
  }

  async removeFromDeck(dcId) {
    const res = await api.delete('api/deckcards/' + dcId)
    logger.log(res.data)
    let existing = AppState.activeDeck.cards?.findIndex(dc => dc.id == dcId)
    if (existing != -1) {
      let card = AppState.activeDeck.cards[existing]
      card.count--
      if (card.count == 0) {
        AppState.activeDeck.cards.splice(existing, 1)
      }
    }
  }

}

export const cardsService = new CardsService()
