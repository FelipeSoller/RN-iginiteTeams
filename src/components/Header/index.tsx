import { useNavigation } from '@react-navigation/native'

import logoImg from '@assets/logo.png'

import { BackButton, BackIcon, Container, Logo } from "./styles"

type Props = {
  showBackButton?: boolean
}

export const Header = ({ showBackButton = false }: Props) => {
  const navigation = useNavigation();
  const handleGoGroups = () => {
    navigation.navigate('groups')
  }

  return (
    <Container>
      {showBackButton &&
      <BackButton onPress={handleGoGroups}>
        <BackIcon />
      </BackButton>}
      <Logo source={logoImg} />
    </Container>
  )
}
