import { Image, Pressable, Text, View } from '@gluestack-ui/themed'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import axios from 'axios'

const PokemonTile = (props) => {
  const [sprite, setSprite] = useState('')

  useEffect(() => {
    const loadPokemonData = async () => {
      const res = await axios.get(props.data.url)
      const data = res.data
      setSprite(
        data.sprites.versions['generation-v']['black-white'].front_default
      )
    }
    loadPokemonData()
  }, [props.refreshing])

  const handlePress = async () => {
    props.navigation.navigate('Details', {
      sprite: sprite,
      url: props.data.url,
    })
  }

  return (
    <View style={styles.tile}>
      <Pressable onPress={() => handlePress()}>
        {sprite && (
          <Image
            size="md"
            borderRadius="$none"
            source={{
              uri: sprite,
            }}
            alt="loading"
          />
        )}
        <Text style={styles.pokemonName}>
          {props.data.nickname ? props.data.nickname : props.data.name}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    height: 150,
    borderRadius: 20,
    borderColor: 'grey',
    borderWidth: 2,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
})

export default PokemonTile
