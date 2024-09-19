import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BackupScreen = ({ navigation }) => {
  const handleBackup = () => {
    Alert.alert('Backup', 'Backup realizado com sucesso!');
  };

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Limpar Dados', 'Todos os dados foram limpos com sucesso!');
      // Atualizar a tela após limpar o AsyncStorage
      navigation.navigate('Home');
    } catch (e) {
      Alert.alert('Erro', 'Ocorreu um erro ao limpar os dados.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Backup</Text>
      <Button title="Realizar Backup" onPress={handleBackup} />
      <Button title="Limpar Dados" onPress={handleClearStorage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default BackupScreen;