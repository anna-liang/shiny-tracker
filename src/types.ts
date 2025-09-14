export enum View {
  Counter = 'counter',
  Hunts = 'hunts',
}

export enum Method {
  RE = 'Random Encounter',
  SR = 'Soft Reset',
  Masuda = 'Masuda Method',
  PokeRadar = 'PokeRadar',
  DexNav = 'DexNav',
  Hordes = 'Horde Hunting',
  FriendSafari = 'Friend Safari',
  ChainFishing = 'Chain Fishing',
  SOS = 'SOS Chaining',
}

export enum GameVersions {
  RGBY = 'Red, Blue, and Yellow',
  GSC = 'Gold, Silver, and Crystal',
  RSE = 'Ruby, Sapphire, and Emerald',
  FRLG = 'FireRed and LeafGreen',
  DPPt = 'Diamond, Pearl, and Platinum',
  HGSS = 'HeartGold and SoulSilver',
  BW = 'Black and White',
  BW2 = 'Black 2 and White 2',
  XY = 'X and Y',
  ORAS = 'Omega Ruby and Alpha Sapphire',
  SM = 'Sun and Moon',
  USUM = 'Ultra Sun and Ultra Moon',
  PikaEevee = `Let's Go, Pikachu! and Let's Go, Eevee!`,
  SwSh = 'Sword and Shield',
  BDSP = 'Brilliant Diamond and Shining Pearl',
  LA = 'Legends: Arceus',
  SV = 'Scarlet and Violet',
  LZA = 'Legends: Z-A',
}

export interface Hunt {
  id: string
  pokemonId?: number
  pokemon?: string
  count: number
  game?: GameVersions
  method: Method
  phase: number
  shinyCharm: boolean
  active: boolean
  sprite?: string
  // date: string
}
