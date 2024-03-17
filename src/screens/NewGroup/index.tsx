import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import { Highlight } from "@components/Highlight"
import { Header } from "@components/Header"
import { Button } from "@components/Button"
import { Input } from "@components/Input"

import { groupCreate } from "@storage/group/groupCreate"

import { Container, Content, Icon } from "./styles"

export const NewGroup = () => {
  const [group, setGroup] = useState('')

  const navigation = useNavigation()

  const handleNew = async () => {
    try {
      await groupCreate(group)

      navigation.navigate('players', { group })
    } catch (error) {
      console.log(error)
    }

  }

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