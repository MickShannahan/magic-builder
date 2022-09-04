


export function formatSFURL(term, options) {
  let out = [`q=${term}`]
  for (let key in options) {
    switch (key) {
      case 'color':
        if (!options.colorStyle) options.colorStyle = '<='
        out.push('color' + options.colorStyle + options.color.join(''))
        break;
      case 'rarity':
        if (!options.rarityStyle) options.rarityStyle = '<='
        out.push(`(${options.rarity.map(r => 'rarity:' + r).join(' OR ')})`)
        break;
      case 'legal':
        out.push(options.legal.map(l => 'legal:' + l).join('+'))
        break;
    }
  }

  return out.join('+')
}
