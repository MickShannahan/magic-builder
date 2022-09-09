import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { logger } from '../utils/Logger.js';
import { cardsService } from "./CardsService.js";



class DecksService {
  async find(query = {}) {
    return await dbContext.Decks.find(query).populate('uniqueCards').populate({
      path: 'cards',
      populate: { path: 'card' }
    })
  }

  async create(body) {
    const deck = await dbContext.Decks.create(body)
    await deck.populate('uniqueCards')
    return deck
  }

  async getById(id) {
    const deck = await dbContext.Decks.findById(id).populate('uniqueCards').populate({
      path: 'cards',
      populate: { path: 'card' }
    })
    if (!deck) {
      throw new BadRequest('no deck by that id')
    }
    return deck
  }

  async update(body, userId) {
    const deck = await this.getById(body.id)
    // @ts-ignore
    if (deck.creatorId.toString() != userId) {
      throw new Forbidden('not allowed to edit this deck')
    }
    await dbContext.Decks.findByIdAndUpdate(deck.id, body)
  }
  async remove(id, userId) {
    const deck = await this.getById(id)
    // @ts-ignore
    if (deck.creatorId.toString() != userId) {
      throw new Forbidden('not allowed to edit this deck')
    }
    await deck.remove()
    await dbContext.DeckCards.deleteMany({ deckId: deck.id })
    return `deleted ${deck.name}`
  }

  async cloneDeck(ogDeck, userId) {
    // copy deck but swap out data to new users
    ogDeck.name += ' copy'
    ogDeck.creatorId = userId
    ogDeck.originalId = ogDeck.id
    const newDeck = await dbContext.Decks.create(ogDeck)
    logger.log('creatied dec', newDeck)

    const ogDeckCards = await dbContext.DeckCards.find({ deckId: ogDeck.id }).populate('card')
    const cardsInOg = ogDeckCards.map(dc => dc.card)
    const yourCards = await cardsService.find({ creatorId: userId })
    // get your cards and check which ones from the cloning deck need to be added to collection, then insert them
    let cardsToAdd = []
    let cardsOwned = []
    cardsInOg.forEach(cd => {
      if (yourCards.find(yc => yc.oracleId == cd.oracleId)) {
        cardsOwned.push(cd)
      } else {
        cardsToAdd.push(cd)
      }
    })
    // convert cards need to add to your cards
    cardsToAdd = cardsToAdd.map(c => {
      let card = c._doc
      card.count = 0
      card.creatorId = userId
      delete card._id
      return card
    })
    logger.log('adding cards', cardsToAdd)
    // insert cards into collection
    let newCards = await dbContext.Cards.insertMany(cardsToAdd)
    let dcsToAdd = [...cardsOwned, ...newCards]
    dcsToAdd = dcsToAdd.map(dc => {
      return { oracleId: dc.oracleId, scryId: dc.scryId, cardId: dc.id, deckId: newDeck.id, creatorId: userId }
    })
    logger.log('new Dcs', dcsToAdd)
    await dbContext.DeckCards.insertMany(dcsToAdd)
    await newDeck.populate('cards uniqueCards')
    return newDeck
  }
}

export const decksService = new DecksService()
