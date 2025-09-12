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

export interface Hunt {
  id: string
  pokemonId?: number
  pokemon?: string
  count: number
  generation?: number
  method: Method
  phase: number
  shinyCharm: boolean
  active: boolean
  sprite?: string
  // date: string
}
