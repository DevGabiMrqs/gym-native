import React from "react";
import { Heading, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { HistoryDTO } from "@dtos/History.DTO";

type Props = {
  data: HistoryDTO;
}


export function HistoryCard({data}: Props) {
  return (
    <TouchableOpacity>
      <HStack w={"full"} px={5} py={4} mb={3} bg={"gray.500"} rounded={"md"} alignItems={"center"} justifyContent={"space-between"}>
        <VStack mr={5} flex={1}>
          <Heading fontSize={"md"} color="white" textTransform={"capitalize"} numberOfLines={1} fontFamily={"heading"}>
            {data.group}
          </Heading>

          <Text fontSize="md" color="gray.100" mt={1} numberOfLines={1}>
            {data.name}
          </Text>
        </VStack>

        <Text fontSize="md" color="gray.300">
          {data.hour}
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}