import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  format,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { BarChart } from "react-native-chart-kit";

export default function Home() {
  // Estados para campos de transação
  const [value, setValue] = useState("");
  const [name, setName] = useState("");

  // Estados para controlar visibilidade dos modais
  const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
  const [modalDespesaVisible, setModalDespesaVisible] = useState(false);

  // Estado para o mês atual
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Estados para dados financeiros
  const [saldo, setSaldo] = useState(0);
  const [saldos, setSaldos] = useState([]);
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);

  // Referência para o ScrollView do gráfico
  const scrollViewRef = useRef(null);

  // Hook para buscar dados quando a tela ganha foco ou quando o mês atual muda
  useFocusEffect(
    useCallback(() => {
      fetchSaldoAtual();
      fetchSaldos();
      calculateTotals();
    }, [currentMonth])
  );

  // Função para buscar o saldo atual do mês
  const fetchSaldoAtual = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("financeData");
      const parsedData = storedData ? JSON.parse(storedData) : {};

      const monthKey = format(currentMonth, "yyyy-MM");
      const previousMonthKey = format(subMonths(currentMonth, 1), "yyyy-MM");

      const transactions = parsedData[monthKey]?.transactions || [];
      const previousSaldo = parsedData[previousMonthKey]?.saldo || 0;

      const saldoAtual = calculateSaldo(transactions) + previousSaldo;
      setSaldo(saldoAtual);

      parsedData[monthKey] = {
        ...parsedData[monthKey],
        saldo: saldoAtual,
        transactions: transactions,
      };
      await AsyncStorage.setItem("financeData", JSON.stringify(parsedData));
    } catch (e) {
      console.error("Erro ao buscar saldo atual:", e);
    }
  }, [currentMonth]);

  // Função para buscar todos os saldos para o gráfico
  const fetchSaldos = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("financeData");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const saldosArray = [];

      Object.keys(parsedData).forEach((monthKey) => {
        const { saldo } = parsedData[monthKey];
        saldosArray.push({ monthKey, saldo });
      });

      // Ordena os saldos por data
      saldosArray.sort((a, b) => {
        const dateA = parseISO(a.monthKey + "-01");
        const dateB = parseISO(b.monthKey + "-01");
        return dateA - dateB;
      });

      setSaldos(saldosArray);
    } catch (e) {
      console.error("Erro ao buscar saldos:", e);
    }
  }, []);

  // Função para calcular o saldo com base nas transações
  const calculateSaldo = useCallback((transactions) => {
    const entradas = transactions.filter((item) => item.type === "entrada");
    const despesas = transactions.filter((item) => item.type === "despesa");
    const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
    const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);
    return totalEntradas - totalDespesas;
  }, []);

  // Função para salvar uma nova transação
  const saveData = useCallback(
    async (tipo) => {
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
          type: tipo,
          name,
          value: parsedValue,
          date: new Date(),
        });

        // Atualiza os saldos de todos os meses, considerando diferentes anos
        const allMonths = Object.keys(parsedData);
        allMonths.sort(); // Garante a ordem correta
        allMonths.forEach((mk) => {
          const currentMonthDate = parseISO(mk + "-01");
          const previousMonthDate = subMonths(currentMonthDate, 1);
          const previousMonthKey = format(previousMonthDate, "yyyy-MM");

          const currentMonthTransactions = parsedData[mk]?.transactions || [];
          const previousMonthSaldo = parsedData[previousMonthKey]?.saldo || 0;

          const saldoAtual = calculateSaldo(currentMonthTransactions) + previousMonthSaldo;
          parsedData[mk].saldo = saldoAtual;
        });

        // Salva os dados atualizados no AsyncStorage
        await AsyncStorage.setItem("financeData", JSON.stringify(parsedData));

        // Reseta os campos e fecha o modal correspondente
        setValue("");
        setName("");
        if (tipo === "entrada") {
          setModalEntradaVisible(false);
        } else {
          setModalDespesaVisible(false);
        }
        fetchSaldoAtual();
        fetchSaldos();
        calculateTotals();
      } catch (e) {
        console.error("Erro ao salvar dados:", e);
      }
    },
    [
      name,
      value,
      currentMonth,
      calculateSaldo,
      fetchSaldoAtual,
      fetchSaldos,
      calculateTotals,
    ]
  );

  // Função para calcular os totais de entradas e despesas do mês atual
  const calculateTotals = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem("financeData");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const monthKey = format(currentMonth, "yyyy-MM");
      const transactions = parsedData[monthKey]?.transactions || [];

      const entradas = transactions.filter((item) => item.type === "entrada");
      const despesas = transactions.filter((item) => item.type === "despesa");

      const totalEntradas = entradas.reduce((sum, item) => sum + item.value, 0);
      const totalDespesas = despesas.reduce((sum, item) => sum + item.value, 0);

      setTotalEntradas(totalEntradas);
      setTotalDespesas(totalDespesas);
    } catch (e) {
      console.error("Erro ao calcular totais:", e);
    }
  }, [currentMonth]);

  // Dados para o gráfico de barras
  const barData = {
    labels: saldos.map(({ monthKey }) =>
      format(parseISO(monthKey + "-01"), "MMM yyyy")
    ),
    datasets: [
      {
        data: saldos.map(({ saldo }) => saldo),
      },
    ],
  };

  const screenWidth = Dimensions.get("window").width - 32; // Ajuste de largura

  // Função para navegar entre meses
  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  // Effect para centralizar o mês atual no gráfico após os saldos serem atualizados
  useEffect(() => {
    if (scrollViewRef.current && saldos.length > 0) {
      const currentMonthKey = format(currentMonth, "yyyy-MM");
      const index = saldos.findIndex((item) => item.monthKey === currentMonthKey);

      if (index !== -1) {
        const barWidth = 60; // Largura estimada de cada barra
        const padding = 10; // Espaçamento entre as barras
        const offset = index * (barWidth + padding) - (screenWidth / 2) + (barWidth / 2);

        // Assegure-se de que o offset seja pelo menos 0
        const scrollTo = offset > 0 ? offset : 0;

        scrollViewRef.current.scrollTo({ x: scrollTo, animated: true });
      }
    }
  }, [saldos, currentMonth, screenWidth]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho com Navegação de Meses */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigateMonth("prev")}>
          <Text style={styles.navButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.header}>{format(currentMonth, "MMMM yyyy")}</Text>
        <TouchableOpacity onPress={() => navigateMonth("next")}>
          <Text style={styles.navButton}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Botões para Adicionar Entradas e Despesas */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.addButton, styles.entradaButton]}
          onPress={() => setModalEntradaVisible(true)}
        >
          <Text style={styles.buttonText}>Adicionar Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.addButton, styles.despesaButton]}
          onPress={() => setModalDespesaVisible(true)}
        >
          <Text style={styles.buttonText}>Adicionar Despesa</Text>
        </TouchableOpacity>
      </View>

      {/* Saldo Atual */}
      <View style={styles.saldoContainer}>
        <Text style={styles.saldoText}>Saldo Atual: R$ {saldo.toFixed(2)}</Text>
      </View>

      {/* Gráfico de Saldos */}
      {barData.labels.length >=0 ? (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Saldo Mensal</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            contentContainerStyle={styles.chartScrollView}
          ><BarChart
              data={{
                labels: barData.labels,
                datasets: barData.datasets,
              }}
              width={barData.labels.length * 70} // Largura dinâmica baseada no número de saldos
              height={220}
              fromZero={true}
              showValuesOnTopOfBars={true}
              showBarTops={false}
              showsHorizontalScrollIndicator={true}
              withInnerLines={true}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Verde para entradas
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  stroke: "#e0e0e0",
                  strokeDasharray: "", // Desabilita linhas tracejadas
                },
                barPercentage: .8,
                useShadowColorFromDataset: false,
              }}
              style={{
                marginVertical: 9,
                borderRadius: 16,
                paddingRight: 70 // Espaçamento à direita para visualização
              }}
                yAxisSuffix="R$"
                yAxisInterval={1}
              verticalLabelRotation={-45} // Rotação dos rótulos para melhor visualização
            />
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.noDataText}>Sem dados disponíveis para o gráfico.</Text>
      )}

      {/* Totais do Mês */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Entradas</Text>
          <Text style={[styles.totalValue, styles.entradasColor]}>
            R$ {totalEntradas.toFixed(2)}
          </Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Despesas</Text>
          <Text style={[styles.totalValue, styles.despesasColor]}>
            R$ {totalDespesas.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Modais Separados para Entrada e Despesa */}

      {/* Modal para Adicionar Entrada */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEntradaVisible}
        onRequestClose={() => {
          setModalEntradaVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nova Entrada</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />

            {/* Botões de Ação */}
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setModalEntradaVisible(false);
                  setName("");
                  setValue("");
                }}
              />
              <Button title="Salvar" onPress={() => saveData("entrada")} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para Adicionar Despesa */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDespesaVisible}
        onRequestClose={() => {
          setModalDespesaVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nova Despesa</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
            />

            {/* Botões de Ação */}
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setModalDespesaVisible(false);
                  setName("");
                  setValue("");
                }}
              />
              <Button title="Salvar" onPress={() => saveData("despesa")} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  chartContainer: {
    width: '100%',
    alignItems: 'center', // Centraliza o gráfico
    marginVertical: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5, // Para Android
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: "#333333",
    textAlign: 'center', // Centraliza o título
  },
  noDataText: {
    fontSize: 16,
    color: "#888", // Cor do texto para dados não disponíveis
    textAlign: 'center', // Centraliza o texto
    marginVertical: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    color: "#333333",
  },
  navButton: {
    fontSize: 24,
    color: "#007AFF",
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  addButton: {
    flex: 0.48,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  entradaButton: {
    backgroundColor: "#4CAF50",
  },
  despesaButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  saldoContainer: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3, // Para Android
  },
  saldoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
  },
  totalsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  totalBox: {
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    color: "#555555",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  entradasColor: {
    color: "#4CAF50",
  },
  despesasColor: {
    color: "#F44336",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    color: "#333333",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
  typeButtonSelectedEntrada: {
    backgroundColor: "#4CAF50",
  },
  typeButtonSelectedDespesa: {
    backgroundColor: "#F44336",
  },
  typeButtonDisabled: {
    backgroundColor: "#ffffff",
    borderColor: "#cccccc",
  },
  typeButtonText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 16,
  },
  typeButtonTextSelected: {
    color: "#ffffff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  chartScrollView: {
    paddingVertical: 8,
  },
});
