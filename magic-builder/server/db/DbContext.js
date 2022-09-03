import mongoose from 'mongoose';
import { AccountSchema } from '../models/Account';
import { CardSchema } from '../models/Card.js';
import { DeckSchema } from '../models/Deck.js';
import { DeckCardSchema } from '../models/DeckCard.js';

class DbContext {
  Account = mongoose.model('Account', AccountSchema);
  Cards = mongoose.model('Card', CardSchema)
  Decks = mongoose.model('Deck', DeckSchema)
  DeckCards = mongoose.model('DeckCard', DeckCardSchema)
}

export const dbContext = new DbContext()
