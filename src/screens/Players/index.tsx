import { Alert, FlatList, TextInput } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useRoute, useNavigation } from "@react-navigation/native"

import { Header } from "@components/Header"
import { Highlight } from "@components/Highlight"
import { ButtonIcon } from "@components/ButtonIcon"
import { Input } from "@components/Input"
import { Filter } from "@components/Filter"
import { PlayerCard } from "@components/PlayerCard"
import { ListEmpty } from "@components/ListEmpty"
import { Button } from "@components/Button"

import { Container, Form, HeaderList, NumberOfPlayers } from "./styles"
import { playerAddByGroup } from "@storage/player/playerAddByGroup"
import { AppError } from "@utils/AppError"
import { getPlayersByGroupAndTeam } from "@storage/player/getPlayersByGroupAndTeam"
import { PlayerStorageDTO } from "@storage/player/PlayerStorageDTO"
import { removePlayerByGroup } from "@storage/player/removePlayerByGroup"
import { removeGroupByName } from "@storage/group/removeGroupByName"
import { Loading } from "@components/Loading"

type RouteParams = {
  group: string
}

export const Players = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const navigation = useNavigation()
  const route = useRoute()

  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  const handleAddPlayers = async () => {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Nova pessoa', 'informe o nome da pessoa para adicionar.')
    }

    const newPlayer = {
      name: newPlayerName,
      team
    }

    try {
      await playerAddByGroup(newPlayer, group)

      newPlayerNameInputRef.current?.blur()

      setNewPlayerName('')
      fetchPlayersByTeam()

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova pessoa', error.message)
      } else {
        Alert.alert('Nova pessoa', 'Não foi possível adicionar')
        console.log(error)
      }
    }
  }

  const fetchPlayersByTeam = async () => {
    try {
      setIsLoading(true)

      const playersByTeam = await getPlayersByGroupAndTeam(group, team)
      setPlayers(playersByTeam)
    } catch (error) {
      console.log(error)
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePlayer = async (playerName: string) => {
    try {
      await removePlayerByGroup(playerName, group)
      fetchPlayersByTeam()
    } catch (error) {
      console.log(error)
      Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.')
    }
  }

  const removeGroup = async () => {
    try {
      await removeGroupByName(group)

      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remover turma', 'Não foi possível remover a turma.')
    }
  }

  const handleRemoveGroup = async () => {
    try {
      Alert.alert(
        'Remover',
        'Deseja remover a turma?',
        [
          {
            text: 'Não',
            style: 'cancel'
          },
          {
            text: 'Sim',
            onPress: () => removeGroup()
          }
        ]
      )
    } catch (error) {
      console.log(error)
      Alert.alert('Remover turma', 'Não foi possível remover a turma.')
    }
  }

  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />

      <Highlight title={group} subtitle="Adicione a galera e separe os times"/>

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayers}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayers}/>
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          horizontal
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      {isLoading ?
        <Loading /> :
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handleRemovePlayer(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time." />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 }
          ]}
        />
      }

      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleRemoveGroup}
      />
    </Container>
  )
}