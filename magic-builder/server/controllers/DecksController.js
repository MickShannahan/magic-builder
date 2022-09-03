import { Auth0Provider } from "@bcwdev/auth0provider";
import { dcService } from "../services/DeckCardsService.js";
import { decksService } from "../services/DecksService.js";
import BaseController from "../utils/BaseController.js";



export class DecksController extends BaseController {
  constructor() {
    super('api/decks')
    this.router
      .get('', this.find)
      .get('/:id', this.findById)
      .get('/:id/cards', this.findDeckCards)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.update)
      .delete('/:id', this.remove)
  }

  async find(req, res, next) {
    try {
      const decks = await decksService.find(req.query)
      return res.send(decks)
    } catch (error) {
      next(error)
    }
  }

  async findById(req, res, next) {
    try {
      const deck = await decksService.getById(req.params.id)
      return res.send(deck)
    } catch (error) {
      next(error)
    }
  }

  async findDeckCards(req, res, next) {
    try {
      const cards = await dcService.find({ deckId: req.params.id })
      return res.send(cards)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const deck = await decksService.create(req.body)
      return res.send(deck)
    } catch (error) {
      next(error)
    }
  }

  async update(req, res, next) {
    try {
      req.body.id = req.params.id
      const deck = await decksService.update(req.body, req.userInfo.id)
      return res.send(deck)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const message = await decksService.remove(req.params.id, req.userInfo.id)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }
}
