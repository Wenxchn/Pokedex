import { SafeAreaView, StyleSheet } from 'react-native'
import { useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import {
  Button,
  ButtonIcon,
  FlatList,
  Input,
  InputField,
  SearchIcon,
  View,
} from '@gluestack-ui/themed'
import PokemonTile from '../components/PokemonTile'
import { useSelector } from 'react-redux'

const Home = ({ navigation }) => {
  const [pokemons, setPokemons] = useState([])
  const [shownPokemons, setShownPokemons] = useState([])
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(true)

  const nicknames = useSelector((state) => state.nicknames)

  useEffect(() => {
    const loadInitialPokemon = async () => {
      const res = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
      const data = res.data.results
      setPokemons(data)
      setShownPokemons(data)
    }
    loadInitialPokemon()
  }, [])

  const handleSearch = async () => {
    let matchingPokemons = []
    let nicknamedMatchingPokemon = []

    for (let nicknameObj of nicknames) {
      if (nicknameObj.nickname.includes(search.toLowerCase())) {
        nicknamedMatchingPokemon.push(nicknameObj)
      }
    }

    for (let pokemon of nicknamedMatchingPokemon) {
      const index = pokemons.findIndex((p) => p.name === pokemon.realname)
      let currentPokemon = pokemons[index]
      currentPokemon.nickname = pokemon.nickname
      matchingPokemons.push(currentPokemon)
    }

    for (let pokemon of pokemons) {
      if (pokemon.name.includes(search.toLowerCase())) {
        if (nicknames.some((p) => p.realname.includes(pokemon.name))) {
          if (!matchingPokemons.some((p) => p.name.includes(pokemon.name))) {
            matchingPokemons.unshift(pokemon)
          }
        } else {
          matchingPokemons.push(pokemon)
        }
      }
    }

    setShownPokemons(matchingPokemons)
    setRefreshing(!refreshing)
  }

  useLayoutEffect(() => {
    handleSearch()
  }, [nicknames])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Input
            variant="rounded"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              placeholder="Pokemon Name"
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
          </Input>
        </View>
        <View>
          <Button
            style={styles.searchButton}
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            onPress={() => handleSearch()}
          >
            <ButtonIcon as={SearchIcon} />
          </Button>
        </View>
      </View>
      <FlatList
        data={shownPokemons}
        extraData={shownPokemons}
        renderItem={({ item }) => (
          <PokemonTile
            data={item}
            refreshing={refreshing}
            navigation={navigation}
          />
        )}
        numColumns={2}
        initialNumToRender={10}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: '5%',
    paddingTop: '10%',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchBarContainer: { flex: 4, marginRight: 5 },
})

export default Home
