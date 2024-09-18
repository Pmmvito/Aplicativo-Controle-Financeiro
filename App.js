import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text } from 'react-native';

import Home from './src/screens/home';
import Financeiro from './src/screens/Financeiro';
// import AddOpcao from './src/screens/AddOpcao';
import Dicas from './src/screens/Dicas';
import Backup from './src/screens/Backup';
// import AddReceita from './src/screens/AddReceita'; 
// import AddDespesas from './src/screens/AddDespesas';
import CustomTabBarButton from './src/components/CustomTabBarButton';
import styles from './src/styles/styles';
import { Modal } from 'react-native-paper';
import CalcularJurosSimples from './src/screens/CalcularJurosSimples';
import CalcularJurosCompostos from './src/screens/CalcularJurosCompostos';
import AcompanharRendimentoCdi from './src/screens/AcompanharRendimentoCdi';

// Cria o Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="CalcularJurosCompostos" component={CalcularJurosCompostos} /> 
        <Stack.Screen name="CalcularJurosSimples" component={CalcularJurosSimples} />
        <Stack.Screen name="AcompanharRendimentoCdi" component={AcompanharRendimentoCdi} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        elevation: 0,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        height: 80,
        paddingBottom: 10,
        ...styles.shadow,
      },
      tabBarItemStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      tabBarActiveTintColor: '#7b147b',
      tabBarInactiveTintColor: '#777',
    }}
  >
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="home-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Home</Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Financeiro"
      component={Financeiro}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="wallet-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Financeiro</Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Add"
      component={Modal}
      options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="add-circle" color={focused ? '#7b147b' : '#fff'} size={60} />
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
      }}
    />
    <Tab.Screen
      name="Dicas"
      component={Dicas}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="bulb-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Dicas</Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Backup"
      component={Backup}
      options={{
        tabBarIcon: ({ color, focused }) => (
          <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
            <Icon name="cloud-upload-outline" color={color} size={30} />
            <Text style={[styles.tabText, { color }]}>Backup</Text>
          </View>
        ),
      }}
    />
  </Tab.Navigator>
);

export default App;
