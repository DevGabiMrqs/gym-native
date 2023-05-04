import React from "react";
import { Heading, HStack, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";


export function HistoryCard() {
  return (
    <TouchableOpacity>
      <HStack w={"full"} px={5} py={4} mb={3} bg={"gray.500"} rounded={"md"} alignItems={"center"} justifyContent={"space-between"}>
        <VStack mr={5} flex={1}>
          <Heading fontSize={"md"} color="white" textTransform={"capitalize"} numberOfLines={1} fontFamily={"heading"}>
            Costas
          </Heading>

          <Text fontSize="lg" color="gray.100" mt={1} numberOfLines={1}>
            
          </Text>
        </VStack>

        <Text fontSize="md" color="gray.300">
          08:56
        </Text>
      </HStack>
    </TouchableOpacity>
  )
}