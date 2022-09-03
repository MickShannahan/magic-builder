import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId



export const DeckCardSchema = new Schema({
  creatorId: { type: ObjectId, required: true, ref: 'Account' },
  deckId: { type: ObjectId, required: true, ref: 'Deck' },
  cardId: { type: String, required: true },
  oracleId: { type: String, required: true },
  scryId: { type: String, required: true },
  count: { type: Number, required: true, default: 1 }
}, { timestamps: false, toJSON: { virtuals: true } })

DeckCardSchema.index({ deckId: 1, oracleId: 1 }, { unique: true })

DeckCardSchema.virtual('card', {
  ref: 'Card',
  localField: 'cardId',
  foreignField: '_id',
  justOne: true
})

DeckCardSchema.virtual('deck', {
  ref: 'Deck',
  localField: 'deckId',
  foreignField: '_id',
  justOne: true
})

DeckCardSchema.virtual('creator', {
  ref: 'Account',
  localField: 'creatorId',
  foreignField: '_id',
  justOne: true
})
