import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { dcService } from "./DeckCardsService.js";




class CardsService {
  async create(body) {
    const existing = await dbContext.Cards.findOne({ scryId: body.scryId, creatorId: body.creatorId })
    if (existing) {
      existing.count++
      await existing.save()
      return existing
    }
    const card = await dbContext.Cards.create(body)
    return card
  }
  async remove(id, userId) {
    const card = await this.findById(id)
    // @ts-ignore
    if (card.creatorId.toString() != userId) {
      throw new Forbidden('can not delete that card')
    }
    card.count--
    await dcService.removeCardFromDecks(card.id, card.count)
    if (card.count == 0) {
      await card.remove()
      return `${card.name} was removed from collection`
    }
    await card.save()
    return `a ${card.name} was removed from collection, ${card.count} remain`
  }

  async findById(id) {
    const card = await dbContext.Cards.findById(id)
    if (!card) {
      throw new BadRequest('no card with that id')
    }
    return card
  }
}

export const cardsService = new CardsService()
