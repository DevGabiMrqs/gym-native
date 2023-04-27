import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "@dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

//método que salva/armazena o usuário
export async function storageUserSave(user: UserDTO){
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
} 

//método que busca a informação armazenada
export async function storageUserGet(){
   const storage =  await AsyncStorage.getItem(USER_STORAGE)
   const user : UserDTO = storage ? JSON.parse(storage) : {};
   return user;
}

export async function storageUserRemove() {
    const storage = await AsyncStorage.removeItem(USER_STORAGE)
}