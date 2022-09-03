import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const DeckSchema = new Schema({
  creatorId: { type: ObjectId, required: true },

  name: { type: String, required: true },
  img: { type: String },
  colors: [{ type: String }],
  format: { type: String }
}, { timestamps: true, toJSON: { virtuals: true } })

DeckSchema.virtual('uniqueCards', {
  ref: 'DeckCard',
  localField: '_id',
  foreignField: 'deckId',
  count: true
})

DeckSchema.virtual('cards', {
  ref: 'DeckCard',
  localField: '_id',
  foreignField: 'deckId',
})
