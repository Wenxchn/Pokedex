import {
  ArrowLeftIcon,
  Button,
  ButtonIcon,
  ButtonText,
  Card,
  EditIcon,
  Heading,
  Image,
  Input,
  InputField,
  Pressable,
  Text,
  View,
} from '@gluestack-ui/themed'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import axios from 'axios'
import Modal from 'react-native-modal'
import { useDispatch, useSelector } from 'react-redux'
import { changeNickname } from '../redux/nicknameTracker'

const Details = (props) => {
  const params = props.route.params
  const [pokemonName, setPokemonName] = useState('')
  const [pokemonNickname, setPokemonNickname] = useState('')
  const [pokemonWeight, setPokemonWeight] = useState('')
  const [pokemonHeight, setPokemonHeight] = useState('')
  const [pokemonTypes, setPokemonTypes] = useState('')
  const [newNickName, setNewNickName] = useState('')
  const [isVisibleEditNameModal, setIsVisibleEditNameModal] = useState(false)

  const dispatch = useDispatch()
  const nicknames = useSelector((state) => state.nicknames)

  useEffect(() => {
    const loadPokemonData = async () => {
      const res = await axios.get(params.url)
      const data = res.data
      setPokemonName(data.name)
      setPokemonHeight(data.height)
      setPokemonWeight(data.weight)
      let currentType = ''
      for (let typeObj of data.types) {
        currentType = currentType + typeObj.type.name + ' '
      }
      setPokemonTypes(currentType)
      if (nicknames.some((n) => n.realname === data.name)) {
        const index = nicknames.findIndex((n) => n.realname === data.name)
        setPokemonNickname(nicknames[index].nickname)
      }
    }
    loadPokemonData()
  }, [])

  const openEditNicknameModal = async () => {
    setIsVisibleEditNameModal(true)
  }

  const handleResetEditNicknameModal = () => {
    setNewNickName('')
    setIsVisibleEditNameModal(false)
  }

  const handleSaveNickName = () => {
    if (newNickName.length > 0) {
      dispatch(
        changeNickname({
          nickname: newNickName.toLowerCase(),
          realname: pokemonName,
        })
      )
      setPokemonNickname(newNickName.toLowerCase())
      handleResetEditNicknameModal()
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Button
          style={styles.backButton}
          size="lg"
          onPress={() => props.navigation.goBack()}
        >
          <ButtonIcon style={{ color: 'black' }} as={ArrowLeftIcon} size="xl" />
        </Button>
        <Pressable
          style={styles.pokemonNameButton}
          onPress={() => openEditNicknameModal()}
        >
          <Heading style={styles.pokemonName}>
            {pokemonNickname === '' ? pokemonName : pokemonNickname}
          </Heading>
          <ButtonIcon as={EditIcon} size="xl" />
        </Pressable>
      </View>
      <View style={styles.spriteContainer}>
        <Image
          borderRadius="$none"
          source={{
            uri: params.sprite,
          }}
          alt="loading"
          style={styles.sprite}
        />
      </View>
      <Card size="md" variant="elevated" m="$3">
        <Heading mb="$1" size="md">
          Type
        </Heading>
        <Text size="sm">{pokemonTypes}</Text>
      </Card>
      <Card size="md" variant="elevated" m="$3">
        <Heading mb="$1" size="md">
          Height
        </Heading>
        <Text size="sm">{pokemonHeight} dm</Text>
      </Card>
      <Card size="md" variant="elevated" m="$3">
        <Heading mb="$1" size="md">
          Weight
        </Heading>
        <Text size="sm">{pokemonWeight} hg</Text>
      </Card>
      <Modal
        style={styles.editNameModal}
        isVisible={isVisibleEditNameModal}
        backdropTransitionOutTiming={0}
        onBackButtonPress={() => handleResetEditNicknameModal()}
        onBackdropPress={() => handleResetEditNicknameModal()}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            paddingHorizontal: '5%',
            height: '50%',
            justifyContent: 'center',
          }}
        >
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
            style={styles.editNameInput}
          >
            <InputField
              placeholder="New Nickname (1 char min)"
              onChangeText={(text) => setNewNickName(text)}
              value={newNickName}
            />
          </Input>
          <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => handleSaveNickName()}
          >
            <ButtonText>Save</ButtonText>
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: '10%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: 'white',
  },
  pokemonNameButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 500,
    marginRight: 5,
  },
  spriteContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 100,
    backgroundColor: '#ececec',
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  sprite: { width: 150, height: 150 },
  editNameModal: { justifyContent: 'flex-end', margin: 0 },
  editNameInput: {
    marginBottom: 15,
  },
})

export default Details
