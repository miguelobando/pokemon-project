import {
  Card,
  CardBody,
  Flex,
  Text,
  Image,
  Stack,
  Button,
} from "@chakra-ui/react";
import { AvailableTrades } from "../../interfaces/AvailableTrades";
import { useToast } from "@chakra-ui/react";
export const TradeCard = ({
  data,
  fnGivePokemon,
}: {
  data: AvailableTrades;
  userId: number;
  fnGivePokemon: (receptorId: number, pokemonId: string) => void;
}) => {
  const toast = useToast();

  const handleGivePokemon = (givePkmFn: () => void, alreadyGiven: boolean) => {
    if (alreadyGiven) {
      toast({
        title: "Pokemon Already Given",
        description: `You already gave a ${data.requestedPokemon.pokemon_name} to ${data.trader.name}`,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      givePkmFn();
    }
  };

  return (
    <Card>
      <CardBody>
        <Flex justifyContent="space-between">
          <Image
            src={data.requestedPokemon.pokemon_sprite}
            alt={data.requestedPokemon.pokemon_name}
            borderRadius="lg"
          />
          <Stack spacing={3} textAlign="center">
            <Text fontSize="lg">{data.requestedPokemon.pokemon_name}</Text>
            <Text>{`Requested by ${data.trader.name}`}</Text>
            {data.owned && (
              <Button
                onClick={() =>
                  handleGivePokemon(
                    () =>
                      fnGivePokemon(
                        data.trader.id,
                        data.requestedPokemon.pokemon_id
                      ),
                    data.alreadyGiven
                  )
                }
                colorScheme={data.alreadyGiven ? "blue" : "green"}
                disabled={true}
                size="sm"
                variant="solid"
              >
                {data.alreadyGiven ? "Already Given" : "Give Pokemon"}
              </Button>
            )}
          </Stack>
        </Flex>
      </CardBody>
    </Card>
  );
};
