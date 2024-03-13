import { StyleSheet } from 'react-native'
import Home from './screens/Home'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { config } from '@gluestack-ui/config'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Details from './screens/Details'
import store from './redux/store'
import { Provider } from 'react-redux'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Details"
              component={Details}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </GluestackUIProvider>
  )
}

const styles = StyleSheet.create({})
