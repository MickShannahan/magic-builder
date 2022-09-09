import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
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
    // ogDeck needs to be the req.body with any relevant info you want to be duplicated across decks, like name format colors etc.
    // you can reset any values that need to be erased or just in the create just don't used them
    // ogDeck.rating = []
    // ogDeck.views = 0
    // copy deck but swap out data to new users
    ogDeck.name += ' copy'
    ogDeck.creatorId = userId
    ogDeck.originalId = ogDeck.id
    const newDeck = await dbContext.Decks.create(ogDeck)

    // get all the cards in the deck
    const ogDeckCards = await dbContext.DeckCards.find({ deckId: ogDeck.id }).populate('card')
    // convert them into just cards instead of deck cards
    const cardsInOg = ogDeckCards.map(dc => dc.card)
    // get cards in your collection
    const yourCards = await cardsService.find({ creatorId: userId })

    // seperate out which cards you have in your collection and which ones you need to add
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
    // insert cards into collection
    let newCards = await dbContext.Cards.insertMany(cardsToAdd)
    // combine cards you already had and cards just inserted into collection
    let dcsToAdd = [...cardsOwned, ...newCards]
    // convert them from cards to deckcards
    dcsToAdd = dcsToAdd.map(dc => {
      return { oracleId: dc.oracleId, scryId: dc.scryId, cardId: dc.id, deckId: newDeck.id, creatorId: userId }
    })
    // insert deck cards
    await dbContext.DeckCards.insertMany(dcsToAdd)
    // populate deck info
    await newDeck.populate('cards uniqueCards')
    // return deck created so the user can be pushed to the deck page they just cloned
    return newDeck
  }
}

export const decksService = new DecksService()
