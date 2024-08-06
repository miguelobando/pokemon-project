import { useContext } from "react";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";
import { useOwnedPokemons } from "../hooks/usePokemons";
import { CircularProgress, SimpleGrid } from "@chakra-ui/react";
import { Pokemon } from "../interfaces/Pokemon";
import { OwnedPokemonCard } from "../containers/mypokemons/OwnedPokemonCard";


export const MyPokemonsPage = () => {
    const { user } = useContext(UserContext) as UserDataContext;
    const { data: ownedPokemons, isLoading: isLoadingOwnedPokemons } =
    useOwnedPokemons(user?.id);

    
    if (isLoadingOwnedPokemons) {
        return <CircularProgress isIndeterminate />;
      }


    if (ownedPokemons) {
        return (
            <SimpleGrid columns={[1, 2, 3]} spacing={5}>
                {ownedPokemons.map((pokemon: Pokemon) => (
                    <OwnedPokemonCard key={pokemon.pokemon_id} data={pokemon} />
                ))}
            </SimpleGrid>
        );
    }

}