import { Card, Box, CardBody, Stack, Heading, Divider, Image, Text } from "@chakra-ui/react";
import { Pokemon } from "../../interfaces/Pokemon";

export const OwnedPokemonCard = ( {data} : {data: Pokemon}) => {
    
    return (
        <Card maxW='sm' mt={6} minW='sm' position="relative">
        
            <CardBody>
                <Box display="flex" justifyContent="center">
                    <Image
                        src={data.pokemon_sprite}
                        alt={data.pokemon_name}
                        borderRadius='lg'
                        
                    />
                </Box>
                <Stack mt='6' spacing='3' textAlign="center">
                    <Heading size='md'>{data.pokemon_name}</Heading>
                    <Text>
                        {`Pokemon #${data.pokemon_id} is a ${data.pokemon_type} type and is named ${data.pokemon_name}`}
                    </Text>
                </Stack>
            </CardBody>
            <Divider />
        </Card>
    )
}