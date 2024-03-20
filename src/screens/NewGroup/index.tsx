import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import { Highlight } from "@components/Highlight"
import { Header } from "@components/Header"
import { Button } from "@components/Button"
import { Input } from "@components/Input"

import { groupCreate } from "@storage/group/groupCreate"

import { Container, Content, Icon } from "./styles"
import { Alert } from "react-native"
import { AppError } from "@utils/AppError"

export const NewGroup = () => {
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  const handleNew = async () => {
    try {
      if (group.trim().length === 0) {
        return Alert.alert('Nova turma', 'Por favor, informe o nome da turma.')
      }

      await groupCreate(group)
      navigation.navigate('players', { group })

    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Nova turma', error.message)
      } else {
        Alert.alert('Nova turma', 'Não foi possível criar uma nova turma')
        console.log(error)
      }
    }
  }
1
  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="crie uma turma para adicionar as pessoas"
        />
        <Input
          placeholder="Nome da turma"
          onChangeText={setGroup}
        />
        <Button
          title="Criar"
          onPress={handleNew}
        />
      </Content>
    </Container>
  )
}