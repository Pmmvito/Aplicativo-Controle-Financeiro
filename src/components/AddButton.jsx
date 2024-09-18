import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import styles from '../styles/styles';

const AddButton = () => (
  <View style={styles.container}>
    <FAB
      icon="plus"
      style={styles.fab}
      onPress={() => console.log('Adicionar dados')}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#f59330',
  },
});

export default AddButton;
