import logoImg from '@assets/logo.png'

import { BackButton, BackIcon, Container, Logo } from "./styles"

type Props = {
  showBackButton?: boolean
}

export const Header = ({ showBackButton = false }: Props) => {
  return (
    <Container>
      {showBackButton && <BackButton>
        <BackIcon />
      </BackButton>}
      <Logo source={logoImg} />
    </Container>
  )
}
