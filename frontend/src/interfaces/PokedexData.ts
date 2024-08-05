import { Pokemon } from "./Pokemon";

export interface PokedexData extends Pokemon {
    owned: boolean;
    asked: boolean;
} 