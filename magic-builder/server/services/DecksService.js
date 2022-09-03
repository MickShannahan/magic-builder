import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";




class DecksService {
  async find(query = {}) {
    return await dbContext.Decks.find(query).populate('uniqueCards')
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

}

export const decksService = new DecksService()
