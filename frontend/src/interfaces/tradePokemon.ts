export interface TradePokemon {
    requested_pokemon_id: string
    requestedPokemon: RequestedPokemon
    trader: Trader
  }
  
  export interface RequestedPokemon {
    pokemon_id: string
    pokemon_name: string
    pokemon_type: string
    pokemon_sprite: string
  }
  
  export interface Trader {
    id: number
    email: string
    password: string
    name: string
    gender: string
  }
  