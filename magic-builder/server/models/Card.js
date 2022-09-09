import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId

export const CardSchema = new Schema({
  creatorId: { type: ObjectId, required: true },
  scryId: { type: String, required: true },
  oracleId: { type: String, required: true },

  wished: { type: Number, required: true, default: 0 },
  count: { type: Number, required: true, default: 1 },

  name: { type: String, required: true },
  imgMed: { type: String },
  imgArt: { type: String },
  text: { type: String },

  type: { type: String },
  colors: [{ type: String }],
  rarity: { type: String },
  cmc: { type: Number },
  borderColor: { type: String },
  formats: { type: Object }
}, { timestamps: false, toJSON: { virtuals: true } })

CardSchema.index({ creatorId: 1, scryId: 1 }, { unique: true })
