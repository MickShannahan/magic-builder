import { Auth0Provider } from "@bcwdev/auth0provider";
import { dcService } from "../services/DeckCardsService.js";
import BaseController from "../utils/BaseController.js";


export class DeckCardsController extends BaseController {
  constructor() {
    super('api/deckcards')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .delete('/:id', this.remove)
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const deckCard = await dcService.create(req.body)
      return res.send(deckCard)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const message = await dcService.remove(req.params.id, req.userInfo.id)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }
}
