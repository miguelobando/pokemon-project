import { useAvailableTrades } from "../hooks/useAvailableTrades";
import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";
import {
  Box,
  CircularProgress,
  Flex,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { AvailableTrades } from "../interfaces/AvailableTrades";
import { TradeCard } from "../containers/trades/TradeCard";
import { useGivePokemon } from "../hooks/useGivePokemon";
import { useToast } from "@chakra-ui/react";

export const TradesPage = () => {
  const { user } = useContext(UserContext) as UserDataContext;
  const { data: availableTrades, isLoading: isLoadingAvailableTrades, refetch } =
    useAvailableTrades(user?.id);
    const toast = useToast();
    const { mutate: handleGivePokemon, isLoading: isGiving } = useGivePokemon();
    const [availablePokemons, setAvailablePokemons] = useState<AvailableTrades[]>([]);

    useEffect(() => {})

    useEffect(() => {
        if (availableTrades) {
            setAvailablePokemons(availableTrades);
        }

    }, [availableTrades]);

    useEffect(() => {
        refetch();
      }, [refetch]);

    const givePokemon = (receptorId: number, pokemonId: string) => {
        if(user?.id != null){
            handleGivePokemon(
                { senderId: user?.id, receptorId, pokemonId },
                {
                    onSuccess: () => {
                        toast({
                            title: 'Pokemon Given',
                            description: `${receptorId} received a ${pokemonId}`,
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                        });
                        setAvailablePokemons((prevData) =>
                            prevData.map((pokemon) =>
                                pokemon.requested_pokemon_id === pokemonId
                                    ? { ...pokemon, alreadyGiven: true }
                                    : pokemon
                            )
                        );
                    },
                    onError: () => {
                        toast({
                            title: 'Error Giving Pokemon',
                            description: `An error occurred while giving the ${pokemonId}`,
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                    },
                }
            );
        }
    };



  if (isLoadingAvailableTrades || isGiving) {
    return <CircularProgress isIndeterminate />;
  }



  if (availableTrades && availableTrades.length > 0 && user?.id) {
    return (
      <Flex
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Text fontSize={"2xl"} textAlign={"center"}>
          Available trades
        </Text>
        <Box width={"100%"} maxW="1200px" mx="auto" mt={10}>
          <SimpleGrid spacing={4} columns={[1, 2, 3]}>
            {availablePokemons.map((trade: AvailableTrades, index: number) => (
              <TradeCard 
                    key={index} data={trade}
                    fnGivePokemon={givePokemon} userId={
                        user.id 
                    }              />
            ))}
          </SimpleGrid>
        </Box>
      </Flex>
    );
  }

  return <Text>No available trades</Text>;
};
