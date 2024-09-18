import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addMonths, subMonths } from 'date-fns';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

export default function Home({ navigation }) {
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('entrada');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [saldoData, setSaldoData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchSaldoData();
    }, [currentMonth])
  );

  const fetchData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('financeData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const monthKey = format(currentMonth, 'yyyy-MM');
        const filteredData = parsedData[monthKey] || [];
        setData(filteredData);

        const entradas = filteredData.filter(item => item.type === 'entrada');
        const despesas = filteredData.filter(item => item.type === 'despesa');
        const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
        const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);
        const saldo = totalEntradas - totalDespesas;
        setSaldo(saldo);

        // Garantir que parsedData[monthKey] seja um objeto
        if (!parsedData[monthKey]) {
          parsedData[monthKey] = [];
        }
        parsedData[monthKey].saldo = saldo;
        await AsyncStorage.setItem('financeData', JSON.stringify(parsedData));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSaldoData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('financeData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const saldoData = [];
        for (let i = 11; i >= 0; i--) {
          const month = subMonths(new Date(), i);
          const monthKey = format(month, 'yyyy-MM');
          const monthData = parsedData[monthKey] || [];
          const entradas = monthData.filter(item => item.type === 'entrada');
          const despesas = monthData.filter(item => item.type === 'despesa');
          const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
          const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);
          const saldo = totalEntradas - totalDespesas;
          saldoData.push(saldo);
        }
        setSaldoData(saldoData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveData = async () => {
    try {
      const existingData = await AsyncStorage.getItem('financeData');
      const data = existingData ? JSON.parse(existingData) : {};
      const monthKey = format(currentMonth, 'yyyy-MM');
      if (!data[monthKey]) {
        data[monthKey] = [];
      }
      data[monthKey].push({ type, name, value: parseFloat(value), date: currentMonth });
      await AsyncStorage.setItem('financeData', JSON.stringify(data));
      setValue('');
      setName('');
      setModalVisible(false);
      fetchData();
      fetchSaldoData();
    } catch (e) {
      console.error(e);
    }
  };

  const entradas = data.filter(item => item.type === 'entrada');
  const despesas = data.filter(item => item.type === 'despesa');
  const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
  const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Controle Financeiro</Text>
      <Text style={styles.subtitle}>{format(currentMonth, 'MMMM yyyy')}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Anterior" onPress={() => setCurrentMonth(subMonths(currentMonth, 1))} />
        <Button title="Próximo" onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} />
      </View>
      <Text style={styles.relation}>Entradas: R$ {totalEntradas.toFixed(2)}</Text>
      <Text style={styles.relation}>Despesas: R$ {totalDespesas.toFixed(2)}</Text>
      <Text style={styles.relation}>Saldo: R$ {saldo !== null ? saldo.toFixed(2) : '0.00'}</Text>
      <Button title="Adicionar Entrada" onPress={() => { setType('entrada'); setModalVisible(true); }} />
      <Button title="Adicionar Despesa" onPress={() => { setType('despesa'); setModalVisible(true); }} />

      <LineChart
        data={{
          labels: Array.from({ length: 12 }, (_, i) => format(subMonths(new Date(), 11 - i), 'MMM')),
          datasets: [
            {
              data: saldoData.length > 0 ? saldoData : [0], // Ensure data is not empty
            },
          ],
        }}
        width={Dimensions.get('window').width - 32} // from react-native
        height={220}
        yAxisLabel="R$"
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

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
          <TextInput
            style={styles.input}
            placeholder="Valor"
            keyboardType="numeric"
            value={value}
            onChangeText={setValue}
          />
          <Button title="Salvar" onPress={saveData} />
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  relation: {
    fontSize: 18,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
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