import { Card, CardBody, Image, Stack, Heading, Text, Divider, ButtonGroup, Button, CardFooter, Box } from "@chakra-ui/react";
import { PokedexData } from "../../interfaces/PokedexData";
import pokemonBall from "../../assets/pokeball.png"; // Adjust the path as necessary

interface PokedexCardProps {
  pokemon: PokedexData;
  askPokemon: (pokemonId: string) => void;
}


export const PokedexCard = ({ pokemon, askPokemon }:  PokedexCardProps ) => {
  

  return (
        <Card maxW='sm' mt={6} minW='sm' position="relative">
            {pokemon.owned && (
                <Box position="absolute" top="10px" right="10px">
                    <Image src={pokemonBall} alt="Owned" boxSize="30px" />
                </Box>
            )}
            <CardBody>
                <Box display="flex" justifyContent="center">
                    <Image
                        src={pokemon.pokemon_sprite}
                        alt={pokemon.pokemon_name}
                        borderRadius='lg'
                        
                    />
                </Box>
                <Stack mt='6' spacing='3' textAlign="center">
                    <Heading size='md'>{pokemon.pokemon_name}</Heading>
                    <Text>
                        {`Pokemon #${pokemon.pokemon_id} is a ${pokemon.pokemon_type} type and is named ${pokemon.pokemon_name}`}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <Box display="flex" justifyContent="center" width="100%">
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' 
                        onClick={() => askPokemon(pokemon.pokemon_id)}
                        colorScheme={
                            pokemon.owned ? 'green' : pokemon.asked ? 'yellow' : 'blue'
                        } disabled={pokemon.owned}>
                            {
                                pokemon.owned
                                    ? 'Owned'
                                    : pokemon.asked
                                        ? 'Asked'
                                        : 'Ask it on trade'
                            }
                        </Button>
                    </ButtonGroup>
                </Box>
            </CardFooter>
        </Card>
    )
}