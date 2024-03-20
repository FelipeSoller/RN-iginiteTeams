import AsyncStorage from "@react-native-async-storage/async-storage"

import { GROUP_COLLECTION } from "@storage/storageConfig"

import { getAllGroups } from "./getAllGroups"
import { AppError } from "@utils/AppError"

export const groupCreate = async (newGroup: string) => {
  try {
    const storedGroups = await getAllGroups()

    const groupAlreadyExists = storedGroups.includes(newGroup)

    if (groupAlreadyExists) {
      throw new AppError('Essa turma ja existe')
    }

    const storage = JSON.stringify([...storedGroups, newGroup])

    await AsyncStorage.setItem(GROUP_COLLECTION, storage)
  } catch (error) {
    throw error
  }

}