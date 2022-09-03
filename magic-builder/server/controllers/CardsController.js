import { Auth0Provider } from "@bcwdev/auth0provider";
import { cardsService } from "../services/CardsService.js";
import BaseController from "../utils/BaseController.js";






export class CardsController extends BaseController {
  constructor() {
    super('api/cards')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .delete('/:id', this.remove)
  }

  async create(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const card = await cardsService.create(req.body)
      return res.send(card)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const message = await cardsService.remove(req.params.id, req.userInfo.id)
      return res.send(message)
    } catch (error) {
      next(error)
    }
  }
}
