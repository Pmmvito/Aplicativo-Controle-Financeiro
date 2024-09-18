import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Modal, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { format, addMonths, subMonths } from 'date-fns';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider } from 'react-native-popup-menu';

export default function Financeiro() {
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('financeData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const monthKey = format(currentMonth, 'yyyy-MM');
        const filteredData = parsedData[monthKey] || [];
        setData(filteredData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentMonth])
  );

  const handleEdit = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setValue(item.value.toString());
    setModalVisible(true);
  };

  const handleDelete = async (item) => {
    const newData = data.filter(i => i !== item);
    setData(newData);
    const storedData = await AsyncStorage.getItem('financeData');
    const parsedData = JSON.parse(storedData);
    const monthKey = format(currentMonth, 'yyyy-MM');
    parsedData[monthKey] = newData;
    await AsyncStorage.setItem('financeData', JSON.stringify(parsedData));
    fetchData(); // Atualiza os dados após deletar
  };

  const saveEdit = async () => {
    const newData = data.map(i => {
      if (i === selectedItem) {
        return { ...i, name, value: parseFloat(value) };
      }
      return i;
    });
    setData(newData);
    const storedData = await AsyncStorage.getItem('financeData');
    const parsedData = JSON.parse(storedData);
    const monthKey = format(currentMonth, 'yyyy-MM');
    parsedData[monthKey] = newData;
    await AsyncStorage.setItem('financeData', JSON.stringify(parsedData));
    setModalVisible(false);
    fetchData(); // Atualiza os dados após editar
  };

  const entradas = data.filter(item => item.type === 'entrada');
  const despesas = data.filter(item => item.type === 'despesa');

  return (
    <MenuProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Financeiro</Text>
        <Text style={styles.subtitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Anterior" onPress={() => setCurrentMonth(subMonths(currentMonth, 1))} />
          <Button title="Próximo" onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} />
        </View>

        <Text style={styles.subtitle}>Entradas</Text>
        <ScrollView style={styles.listContainer}>
          {entradas.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValue}>R$ {item.value ? item.value.toFixed(2) : '0.00'}</Text>
              </View>
              <Menu>
                <MenuTrigger>
                  <Icon name="cog" size={20} color="gray" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => handleEdit(item)} text="Editar" />
                  <MenuOption onSelect={() => handleDelete(item)} text="Excluir" />
                </MenuOptions>
              </Menu>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.subtitle}>Despesas</Text>
        <ScrollView style={styles.listContainer}>
          {despesas.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemValueDespesas}>R$ {item.value ? item.value.toFixed(2) : '0.00'}</Text>
              </View>
              <Menu>
                <MenuTrigger>
                  <Icon name="cog" size={20} color="gray" />
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption onSelect={() => handleEdit(item)} text="Editar" />
                  <MenuOption onSelect={() => handleDelete(item)} text="Excluir" />
                </MenuOptions>
              </Menu>
            </View>
          ))}
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.currency}>R$</Text>
              <TextInput
                style={styles.inputValue}
                placeholder="Valor"
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
              />
            </View>
            <Button title="Salvar" onPress={saveEdit} />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f0f0',
      },
      title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 4,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
      },
      listContainer: {
        maxHeight: 200, // Limita a altura máxima de cada lista
        marginBottom: 16,
      },
      itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      itemTextContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
      itemName: {
        fontSize: 18,
        color: '#333',
      },
      itemValue: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: 'bold',
      },
      itemValueDespesas: {
        fontSize: 16,
        color: '#F44336',
        fontWeight: 'bold',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 12,
        paddingHorizontal: 8,
      },
      currency: {
        fontSize: 18,
        color: '#333',
        marginRight: 4,
      },
      inputValue: {
        flex: 1,
        height: 40,
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4,
      },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    color: 'blue',
    marginTop: 15,
  },
});