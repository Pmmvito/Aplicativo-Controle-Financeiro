import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Button,
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
import { LineChart } from "react-native-chart-kit";

export default function Home({ navigation }) {
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
      console.error(e);
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
      console.error(e);
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

      parsedData[monthKey].transactions.push({
        type,
        name,
        value: parsedValue,
        date: new Date(),
      });

      const saldoAtual =
        calculateSaldo(parsedData[monthKey].transactions) + previousMonthSaldo;
      parsedData[monthKey].saldo = saldoAtual;

      await AsyncStorage.setItem("financeData", JSON.stringify(parsedData));

      setValue("");
      setName("");
      setModalVisible(false);
      fetchData();
      fetchSaldos();
    } catch (e) {
      console.error(e);
    }
  }, [
    name,
    value,
    type,
    currentMonth,
    previousMonthSaldo,
    calculateSaldo,
    fetchData,
    fetchSaldos,
  ]);

  const chartData = useMemo(
    () => ({
      labels: Array.from({ length: 12 }, (_, i) =>
        format(addMonths(startOfYear(new Date()), i), "MMM")
      ),
      datasets: [
        {
          data: saldos,
        },
      ],
    }),
    [saldos]
  );

  const totalEntradas = useMemo(() => {
    return data
      .filter((item) => item.type === "entrada")
      .reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const totalDespesas = useMemo(() => {
    return data
      .filter((item) => item.type === "despesa")
      .reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Controle Financeiro</Text>
      <Text style={styles.subtitle}>{format(currentMonth, "MMMM yyyy")}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Anterior"
          onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}
        />
        <Button
          title="Próximo"
          onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
        />
      </View>
      <Text style={styles.relation}>
        Saldo do Mês Anterior: R$ {previousMonthSaldo.toFixed(2)}
      </Text>
      <Text style={styles.relation}>
        Entradas: R$ {totalEntradas.toFixed(2)}
      </Text>
      <Text style={styles.relation}>
        Despesas: R$ {totalDespesas.toFixed(2)}
      </Text>
      <Text style={styles.relation}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>
      <Button
        title="Adicionar Entrada"
        onPress={() => {
          setType("entrada");
          setModalVisible(true);
        }}
      />
      <Button
        title="Adicionar Despesa"
        onPress={() => {
          setType("despesa");
          setModalVisible(true);
        }}
      />
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Saldo dos Últimos 12 Meses</Text>
        <LineChart
          data={chartData}
          width={385} // Largura fixa para o gráfico
          height={220}
          yAxisLabel="R$"
          chartConfig={{
            backgroundColor: "#022173",
            backgroundGradientFrom: "#1E3A8A",
            backgroundGradientTo: "#3B82F6",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#3B82F6",
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // Remove dashed lines
            },
          }}
          bezier
          style={styles.chartStyle}
        />
      </View>
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

      {/* Espaçamento no final para permitir o scroll */}
      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  relation: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  chartContainer: {
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  chartTitle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
  },
  chartStyle: {
    borderRadius: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    color: "blue",
    marginTop: 15,
  },
  contentContainer: {
    paddingBottom: 50, // Espaçamento extra no final
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },

  spacing: {
    height: 150, 
  },
});
