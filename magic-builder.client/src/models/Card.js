

export class Card {
  constructor(data) {
    this.id = data.object ? 'search card' : data.id
    this.creatorId = data.creatorId || 'search card'
    this.scryId = data.object ? data.id : data.scryId
    this.oracleId = data.oracleId || data.oracle_id

    this.wished = data.owned || 0
    this.count = data.count || 1

    this.name = data.name
    this.imgSm = data.imgSm || data.image_uris?.small
    this.imgMed = data.imgMed || data.image_uris?.normal
    this.imglg = data.imglg || data.image_uris?.large
    this.imgNoB = data.imgNoB || data.image_uris?.border_crop
    this.imgArt = data.imgArt || data.image_uris?.art_crop
    this.text = data.text || data.oracle_text
    this.flavor = data.flavor || data.flavor_text
    this.released = data.released || data.released_at
    this.set = data.set || data.set_name
    this.mana = data.mana || data.mana_cost

    this.type = data.type || data.type_line
    this.colors = data.colors
    this.rarity = data.rarity
    this.cmc = data.cmc
    this.borderColor = data.borderColor || data.border_color
    this.formats = data.formats != undefined ? this.mapLegals(data.formats) : this.mapLegals(data.legalities)
  }

  mapLegals(obj) {
    if (!obj) {
      return undefined
    }
    for (let key in obj) {
      obj[key] = obj[key] == 'legal' ? true : false
    }
    return obj
  }
}
