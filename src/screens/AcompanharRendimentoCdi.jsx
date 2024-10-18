import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const AcompanharRendimentoCdi = () => {
  const navigation = useNavigation();
  const [investedAmount, setInvestedAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [cdiRate, setCdiRate] = useState(0); // Taxa CDI mensal em decimal
  const [selectedOption, setSelectedOption] = useState("");

  // Novos estados para cálculos
  const [rendimentoBruto, setRendimentoBruto] = useState(0);
  const [rendimentoLiquido, setRendimentoLiquido] = useState(0);
  const [valorLiquidoAcumulado, setValorLiquidoAcumulado] = useState(0);

  useEffect(() => {
    const fetchCdiRate = async () => {
      try {
        const response = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json"
        );
        const data = await response.json();
        // Supondo que o valor do CDI está no campo 'valor' e usa vírgula como decimal
        const latestCdi = parseFloat(data[data.length - 1].valor.replace(",", "."));
        setCdiRate(latestCdi / 100); // Convertendo para decimal
      } catch (error) {
        console.error("Erro ao buscar a taxa CDI:", error);
      }
    };

    const loadStoredData = async () => {
      try {
        const storedAmount = await AsyncStorage.getItem("currentAmount");
        if (storedAmount !== null) {
          setCurrentAmount(parseFloat(storedAmount));
        }

        const storedRendimentoBruto = await AsyncStorage.getItem("rendimentoBruto");
        if (storedRendimentoBruto !== null) {
          setRendimentoBruto(parseFloat(storedRendimentoBruto));
        }

        const storedRendimentoLiquido = await AsyncStorage.getItem("rendimentoLiquido");
        if (storedRendimentoLiquido !== null) {
          setRendimentoLiquido(parseFloat(storedRendimentoLiquido));
        }

        const storedValorLiquidoAcumulado = await AsyncStorage.getItem("valorLiquidoAcumulado");
        if (storedValorLiquidoAcumulado !== null) {
          setValorLiquidoAcumulado(parseFloat(storedValorLiquidoAcumulado));
        }
      } catch (error) {
        console.error("Erro ao carregar dados armazenados:", error);
      }
    };

    fetchCdiRate();
    loadStoredData();
  }, []);

  useEffect(() => {
    const updateAmount = async () => {
      if (currentAmount > 0 && cdiRate > 0) {
        // Atualiza o valor atual com a taxa mensal
        const newAmount = currentAmount * (1 + cdiRate);
        setCurrentAmount(newAmount);
        await AsyncStorage.setItem("currentAmount", newAmount.toString());

        // Recalcula as projeções com o novo valor
        if (selectedOption !== "") {
          calcularProjecoes(newAmount, parseFloat(monthlyContribution), selectedOption);
        }
      }
    };

    const interval = setInterval(updateAmount, 30 * 24 * 60 * 60 * 1000); // Aproximadamente 1 mês

    return () => clearInterval(interval);
  }, [currentAmount, cdiRate, selectedOption, monthlyContribution]);

  useEffect(() => {
    if (currentAmount > 0 && cdiRate > 0 && selectedOption !== "") {
      calcularProjecoes(currentAmount, parseFloat(monthlyContribution), selectedOption);
    }
  }, [currentAmount, cdiRate, selectedOption, monthlyContribution]);

  const handleInvest = () => {
    const amount = parseFloat(investedAmount);
    const contribution = parseFloat(monthlyContribution);
    if (!isNaN(amount) && !isNaN(contribution)) {
      setCurrentAmount(amount);
      AsyncStorage.setItem("currentAmount", amount.toString());
      calcularProjecoes(amount, contribution, selectedOption);
    } else {
      Alert.alert("Entradas Inválidas", "Por favor, insira valores válidos para investimento e aporte mensal.");
    }
  };

  const calcularJurosCompostos = (pv, pmt, r, n) => {
    if (r === 0) {
      // Evita divisão por zero
      const fv = pv + pmt * n;
      const rendimentoBruto = fv - pv - pmt * n;
      return { fv, rendimentoBruto };
    }
    const fator = Math.pow(1 + r, n);
    const fv = pv * fator + pmt * ((fator - 1) / r);
    const rendimentoBruto = fv - pv - pmt * n;
    return { fv, rendimentoBruto };
  };

  const calcularProjecoes = async (amount, contribution = 0, periodo) => {
    let meses = 0;
    let imposto = 0;

    switch (periodo) {
      case "1 Semana":
        meses = 0.23; // Aproximação: 1 semana ≈ 0.23 meses
        imposto = 0.225;
        break;
      case "1 Mês":
        meses = 1;
        imposto = 0.225;
        break;
      case "1 Ano":
        meses = 12;
        imposto = 0.175;
        break;
      case "5 Anos":
        meses = 60;
        imposto = 0.15;
        break;
      case "10 Anos":
        meses = 120;
        imposto = 0.15;
        break;
      default:
        meses = 0;
        imposto = 0;
    }

    if (meses === 0) {
      setValorLiquidoAcumulado(0);
      setRendimentoBruto(0);
      setRendimentoLiquido(0);
      return;
    }

    // Calcula o valor futuro usando juros compostos
    const { fv, rendimentoBruto } = calcularJurosCompostos(amount, contribution, cdiRate, meses);
    // Calcula o rendimento líquido após impostos
    const rendimentoLiquido = rendimentoBruto * (1 - imposto);
    // Valor líquido acumulado
    const valorLiquidoAcumulado = fv;

    setRendimentoBruto(rendimentoBruto.toFixed(2));
    setRendimentoLiquido(rendimentoLiquido.toFixed(2));
    setValorLiquidoAcumulado(valorLiquidoAcumulado.toFixed(2));

    // Armazena os valores no AsyncStorage
    try {
      await AsyncStorage.setItem("rendimentoBruto", rendimentoBruto.toFixed(2));
      await AsyncStorage.setItem("rendimentoLiquido", rendimentoLiquido.toFixed(2));
      await AsyncStorage.setItem("valorLiquidoAcumulado", valorLiquidoAcumulado.toString());
    } catch (error) {
      console.error("Erro ao armazenar os rendimentos:", error);
    }
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const renderSelectedOption = () => {
    if (!selectedOption) return null;

    return (
      <>
        <Text style={styles.result}>
          Período Selecionado: {selectedOption}
        </Text>
        <Text style={styles.result}>
          Rendimento Bruto: {formatCurrency(rendimentoBruto)}
        </Text>
        <Text style={styles.result}>
          Rendimento Líquido: {formatCurrency(rendimentoLiquido)} (após impostos)
        </Text>
        <Text style={styles.result}>
          Valor Líquido Acumulado: {formatCurrency(valorLiquidoAcumulado)}
        </Text>
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Acompanhar Rendimento CDI</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantos reais você tem investido?"
        keyboardType="numeric"
        value={investedAmount}
        onChangeText={setInvestedAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Aporte Mensal"
        keyboardType="numeric"
        value={monthlyContribution}
        onChangeText={setMonthlyContribution}
      />
      <Button title="Investir" onPress={handleInvest} color="#6200ea" />
      <Text style={styles.result}>
        Valor Atual: {formatCurrency(currentAmount)}
      </Text>

      {/* Exibição dos Resultados */}
      {renderSelectedOption()}

      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione uma opção" value="" />
        <Picker.Item label="1 Semana" value="1 Semana" />
        <Picker.Item label="1 Mês" value="1 Mês" />
        <Picker.Item label="1 Ano" value="1 Ano" />
        <Picker.Item label="5 Anos" value="5 Anos" />
        <Picker.Item label="10 Anos" value="10 Anos" />
      </Picker>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#6200ea",
    borderRadius: 5,
    alignItems: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#333333",
  },
  input: {
    height: 50,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333333",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
  },
});

export default AcompanharRendimentoCdi;
