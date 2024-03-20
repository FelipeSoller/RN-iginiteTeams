import { PLAYER_COLLECTION } from "@storage/storageConfig"
import { getPlayersByGroup } from "./getPlayersByGroup"
import AsyncStorage from "@react-native-async-storage/async-storage"


export const removePlayerByGroup = async (playerName: string, group: string) => {
  try {
    const storage = await getPlayersByGroup(group)

    const filtered = storage.filter(player => player.name !== playerName)

    const players = JSON.stringify(filtered)

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players)

  } catch (error) {
    throw error
  }
}