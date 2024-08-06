import { TradePokemon } from "./tradePokemon";

export interface AvailableTrades extends TradePokemon {
    owned: boolean;
    alreadyGiven: boolean;
}
