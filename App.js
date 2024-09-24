import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';

import Home from './src/screens/home';
import Financeiro from './src/screens/Financeiro';
import Dicas from './src/screens/Dicas';
import CustomTabBarButton from './src/components/CustomTabBarButton';
import styles from './src/styles/styles';
import CalcularJurosSimples from './src/screens/CalcularJurosSimples';
import CalcularJurosCompostos from './src/screens/CalcularJurosCompostos';
import AcompanharRendimentoCdi from './src/screens/AcompanharRendimentoCdi';

// Cria o Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="CalcularJurosCompostos" component={CalcularJurosCompostos} />
        <Stack.Screen name="CalcularJurosSimples" component={CalcularJurosSimples} />
        <Stack.Screen name="AcompanharRendimentoCdi" component={AcompanharRendimentoCdi} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleNavigation = (route) => {
    closeModal();
    navigation.navigate(route);
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <>
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
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon name="add-circle" color={focused ? '#7b147b' : '#fff'} size={60} />
            ),
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        >
          {() => null}
        </Tab.Screen>
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
          name="Calculadora"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={[styles.tabButton, focused ? styles.activeTab : null]}>
                <View style={modalStyles.floatingButton}>
                  <Icon name="calculator-outline" color={'#fff'} size={30} />
                </View>
                <Text style={[styles.tabText, { color }]}>Calculadora</Text>
              </View>
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={openModal}
              />
            ),
          }}
        >
          {() => null}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Modal for Calculadora */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
        >
          <Animated.View style={[modalStyles.modalContainer, { opacity: fadeAnim }]}>
            <View style={modalStyles.modalContent}>
              <Text style={modalStyles.modalTitle}>Selecione uma opção</Text>
              <TouchableOpacity
                style={modalStyles.modalOption}
                onPress={() => handleNavigation('CalcularJurosCompostos')}
              >
                <Icon name="trending-up-outline" color="#7b147b" size={24} />
                <Text style={modalStyles.modalOptionText}>Juros Compostos</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.modalOption}
                onPress={() => handleNavigation('CalcularJurosSimples')}
              >
                <Icon name="stats-chart-outline" color="#7b147b" size={24} />
                <Text style={modalStyles.modalOptionText}>Juros Simples</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.modalOption}
                onPress={() => handleNavigation('AcompanharRendimentoCdi')}
              >
                <Icon name="pulse-outline" color="#7b147b" size={24} />
                <Text style={modalStyles.modalOptionText}>Acompanhar CDI</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={modalStyles.closeButton}
                onPress={closeModal}
              >
                <Text style={modalStyles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Modal>
      )}
    </>
  );
};

// Novo Estilo de Modal
const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '100%',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
    marginLeft: 15,
  },
  closeButton: {
    backgroundColor: '#7b147b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7b147b',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default App;
