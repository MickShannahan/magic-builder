import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { cardsService } from "./CardsService.js";



class DeckCardsService {
  async find(query = {}) {
    return await dbContext.DeckCards.find(query)
  }

  async create(body) {
    const card = await cardsService.findById(body.cardId)
    const existing = await dbContext.DeckCards.findOne({ creatorId: body.creatorId, oracleId: card.oracleId }).populate('card')
    if (existing) {
      existing.count++
      if (existing.count > card.count) {
        throw new BadRequest(`not enough ${card.name} in collection for this deck. ${existing.count - 1} used and ${card.count} are in your collection`)
      }
      await existing.save()
      return existing
    }
    const dc = await dbContext.DeckCards.create({ ...body, scryId: card.scryId, oracleId: card.oracleId })
    await dc.populate('card')
    return dc
  }

  async remove(id, userId) {
    const dc = await dbContext.DeckCards.findById(id).populate('card deck')
    if (!dc) throw new BadRequest('bad deck-card id')
    // @ts-ignore
    if (dc.creatorId.toString() != userId) throw new Forbidden('not allowed to remove card from deck')
    dc.count--
    if (dc.count == 0) {
      await dc.remove()
      // @ts-ignore
      return `removed ${dc.card.name} from ${dc.deck.name}`
    }
    await dc.save()
    return `removed a ${dc.card.name} from ${dc.deck.name}, ${dc.count} remain.`
  }
  async removeCardFromDecks(cardId, count) {
    const dcs = await dbContext.DeckCards.find({ cardId }).populate('card')
    dcs.forEach(d => {
      if (d.count > count) {
        d.count--
        if (d.count == 0) {
          d.remove()
          return
        }
        d.save()
      }
    })
  }

}

export const dcService = new DeckCardsService()
