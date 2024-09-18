import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

const BackupScreen = ({ navigation }) => {
  const handleBackup = () => {
    Alert.alert('Backup', 'Backup realizado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Backup</Text>
      <Button title="Realizar Backup" onPress={handleBackup} />
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