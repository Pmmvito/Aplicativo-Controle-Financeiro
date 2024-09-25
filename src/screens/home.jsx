import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, addMonths, subMonths, startOfYear } from "date-fns";
import { useFocusEffect } from "@react-navigation/native";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from 'expo-linear-gradient'; // Use expo-linear-gradient

export default function Home() {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("entrada");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [previousMonthSaldo, setPreviousMonthSaldo] = useState(0);
  const [saldos, setSaldos] = useState(Array(12).fill(0));

  useFocusEffect(
    
    useCallback(() => {
      fetchData();
      fetchSaldos();
    }, [currentMonth])
    
  );
  

  const fetchData = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("financeData");
      const parsedData = storedData ? JSON.parse(storedData) : {};

      const monthKey = format(currentMonth, "yyyy-MM");
      const previousMonthKey = format(subMonths(currentMonth, 1), "yyyy-MM");

      const filteredData = parsedData[monthKey]?.transactions || [];
      const previousSaldo = parsedData[previousMonthKey]?.saldo || 0;

      setPreviousMonthSaldo(previousSaldo);
      setData(filteredData);

      const saldoAtual = calculateSaldo(filteredData) + previousSaldo;
      setSaldo(saldoAtual);

      parsedData[monthKey] = {
        ...parsedData[monthKey],
        saldo: saldoAtual,
        transactions: filteredData,
      };
      await AsyncStorage.setItem("financeData", JSON.stringify(parsedData));
    } catch (e) {
      console.error("Erro ao buscar dados:", e);
    }
  }, [currentMonth]);

  const fetchSaldos = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("financeData");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const saldosArray = [];
  
      const startDate = startOfYear(new Date());
  
      for (let i = 0; i < 12; i++) {
        const monthKey = format(addMonths(startDate, i), "yyyy-MM");
        const saldo = parsedData[monthKey]?.saldo || 0;
        saldosArray.push(saldo);
      }
  
      setSaldos(saldosArray);
    } catch (e) {
      console.error("Erro ao buscar saldos:", e);
    }
  }, []);

  const calculateSaldo = useCallback((transactions) => {
    const entradas = transactions.filter((item) => item.type === "entrada");
    const despesas = transactions.filter((item) => item.type === "despesa");
    const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
    const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);
    return totalEntradas - totalDespesas;
  }, []);

const saveData = useCallback(async () => {
  if (!name || !value) {
    Alert.alert("Erro", "Preencha todos os campos antes de salvar.");
    return;
  }

  try {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      Alert.alert("Erro", "O valor deve ser numérico.");
      return;
    }

    const storedData = await AsyncStorage.getItem("financeData");
    const parsedData = storedData ? JSON.parse(storedData) : {};
    const monthKey = format(currentMonth, "yyyy-MM");

    if (!parsedData[monthKey]) {
      parsedData[monthKey] = { transactions: [], saldo: 0 };
    }

    // Adiciona a nova transação
    parsedData[monthKey].transactions.push({
      type,
      name,
      value: parsedValue,
      date: new Date(),
    });

    // Atualiza todos os saldos dos meses a partir de janeiro até o mês atual
    const startDate = startOfYear(new Date());
    for (let i = 0; i < 12; i++) {
      const currentMonthKey = format(addMonths(startDate, i), "yyyy-MM");
      const previousMonthKey = format(subMonths(addMonths(startDate, i), 1), "yyyy-MM");

      // Transações do mês atual
      const currentMonthTransactions = parsedData[currentMonthKey]?.transactions || [];
      const previousMonthSaldo = parsedData[previousMonthKey]?.saldo || 0;

      // Recalcula o saldo do mês
      const saldoAtual = calculateSaldo(currentMonthTransactions) + previousMonthSaldo;

      parsedData[currentMonthKey] = {
        ...parsedData[currentMonthKey],
        saldo: saldoAtual,
        transactions: currentMonthTransactions,
      };
    }

    // Salva os dados atualizados no AsyncStorage
    await AsyncStorage.setItem("financeData", JSON.stringify(parsedData));

    setValue("");
    setName("");
    setModalVisible(false);
    fetchData();
    fetchSaldos();  // Atualiza os saldos de todos os meses para o gráfico
  } catch (e) {
    console.error("Erro ao salvar dados:", e);
  }
}, [
  name,
  value,
  type,
  currentMonth,
  calculateSaldo,
  fetchData,
  fetchSaldos,
]);

  const totalEntradas = data
    .filter((item) => item.type === "entrada")
    .reduce((sum, item) => sum + item.value, 0);

  const totalDespesas = data
    .filter((item) => item.type === "despesa")
    .reduce((sum, item) => sum + item.value, 0);

  // Ajuste na criação do barData
const barData = saldos.map((saldo, index) => {
  const monthDate = addMonths(startOfYear(currentMonth), index);
  return {
    value: saldo,
    label: format(monthDate, "MMM"),
  };
}).filter(item => item.value !== 0); // Filtra saldos zero

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Controle Financeiro</Text>
      <Text style={styles.subtitle}>{format(currentMonth, "MMMM yyyy")}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.dataContainer}>
        <Text style={styles.relation}>Saldo do Mês Anterior: R$ {previousMonthSaldo.toFixed(2)}</Text>
        <Text style={styles.relation}>Entradas: R$ {totalEntradas.toFixed(2)}</Text>
        <Text style={styles.relation}>Despesas: R$ {totalDespesas.toFixed(2)}</Text>
        <Text style={styles.relation}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>
      </View>

      {barData.length > 0 ? (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Saldo Mensal</Text>
    <BarChart
      data={barData}               // Dados dos saldos mensais
      barWidth={20}                // Largura das barras
      barBorderRadius={5}          // Bordas arredondadas das barras
      frontColor="#6c5ce7"         // Cor das barras
      yAxisThickness={1}           // Espessura do eixo Y
      xAxisThickness={1}           // Espessura do eixo X
      height={220}                 // Altura do gráfico
      hideRules                    // Oculta as linhas-guia do gráfico (opcional)
      isAnimated={true}            // Ativa animação no gráfico
      showFractionalValues={true}  // Exibe valores fracionados no eixo Y
      labelWidth={30}              // Largura das labels no eixo X
      yAxisLabelTexts={[]} // Exemplo de valores no eixo Y
    />
  </View>
) : (
  <Text style={styles.noDataText}>Sem dados disponíveis para o gráfico.</Text>
)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.entryButton} onPress={() => { setType("entrada"); setModalVisible(true); }}>
          <Text style={styles.buttonText}>Adicionar Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.expenseButton} onPress={() => { setType("despesa"); setModalVisible(true); }}>
          <Text style={styles.buttonText}>Adicionar Despesa</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput style={styles.input} placeholder="Nome" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Valor" keyboardType="numeric" value={value} onChangeText={setValue} />
          <TouchableOpacity onPress={saveData}>
            <LinearGradient colors={['#6c5ce7', '#a29bfe']} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Salvar</Text>
            </LinearGradient>
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#f0f0f5",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#7a7a7a",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: 15,
    backgroundColor: "#6c5ce7",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
  },
  dataContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  relation: {
    fontSize: 16,
    color: "#2e384d",
    marginVertical: 4,
  },
  entryButton: {
    flex: 1,
    backgroundColor: "#6c5ce7",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  expenseButton: {
    flex: 1,
    backgroundColor: "#e63946",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#fff",
  },
  modalButton: {
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "500",
  },
  closeButton: {
    textAlign: "center",
    marginTop: 10,
    color: "#fff",
  },
});
