import { useAllPokemons, useOwnedPokemons } from "../hooks/usePokemons";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";
import { CircularProgress, SimpleGrid, useToast } from "@chakra-ui/react";
import { Pokemon } from "../interfaces/Pokemon";
import { PokedexData } from "../interfaces/PokedexData";
import { PokedexCard } from "../containers/pokedex/PokedexCard";
import { useAlreadyAskedPokemon } from "../hooks/useAlreadyAskedPokemon";
import { useAskPokemon } from "../hooks/useAskPokemon";

export const PokedexPage = () => {
  
   const { user } = useContext(UserContext) as UserDataContext;
  
    const { data: allPokemons, isLoading: isLoadingAllPokemons } =
    useAllPokemons();
  
    const { data: ownedPokemons, isLoading: isLoadingOwnedPokemons } =
    useOwnedPokemons(user?.id);
  
    const {
    data: alreadyAskedPokemons,
    isLoading: isLoadingAlreadyAskedPokemons,
  } = useAlreadyAskedPokemon(user?.id);

  const toast = useToast();
  
  const { mutate: handleAskPokemon, isLoading: isAskin } = useAskPokemon();

  const [pokedexData, setPokedexData] = useState<PokedexData[]>([]);

  useEffect(() => {
    if (allPokemons && ownedPokemons && alreadyAskedPokemons) {
      const pokedexDataResult = allPokemons.map((pokemon: Pokemon) => {
        const owned = ownedPokemons.find(
          (ownedPokemon: Pokemon) =>
            ownedPokemon.pokemon_id === pokemon.pokemon_id
        );
        return {
          ...pokemon,
          owned: owned == undefined ? false : true,
          asked: false,
        };
      });
      setPokedexData(pokedexDataResult);
    }
  }, [allPokemons, ownedPokemons, alreadyAskedPokemons]);

  const askPokemon = (pokemonId: string) => {
  

    const pokemonName = pokedexData.find((pokemon) => pokemon.pokemon_id === pokemonId)?.pokemon_name;

    if(user?.id != null){
        handleAskPokemon({ userId: user.id, pokemonId },
            {
               onSuccess: () => {
                   toast({
                       title: 'Pokemon Asked',
                       description: `${pokemonName} was asked`,
                       status: 'success',
                       duration: 9000,
                       isClosable: true,
                   });
                   setPokedexData((prevData) =>
                    prevData.map((pokemon) =>
                      pokemon.pokemon_id === pokemonId
                        ? { ...pokemon, asked: !pokemon.asked }
                        : pokemon
                    )
                  );

               },
               onError: () => {
                   toast({
                       title: 'Error Asking Pokemon',
                       description: `An error occurred while asking the ${pokemonName}`,
                       status: 'error',
                       duration: 9000,
                       isClosable: true,
                   });
               },
            }
       );
    }


  };

  if (
    isLoadingAllPokemons ||
    (user?.id && isLoadingOwnedPokemons && isLoadingAlreadyAskedPokemons)
    || isAskin
) {
    return <CircularProgress isIndeterminate />;
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={5}>
      {pokedexData.map((pokemon: PokedexData) => (
        <PokedexCard
          key={pokemon.pokemon_id}
          pokemon={pokemon}
          askPokemon={askPokemon}
        />
      ))}
    </SimpleGrid>
  );
};
