import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const AcompanharRendimentoCdi = () => {
  const navigation = useNavigation();
  const [investedAmount, setInvestedAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [cdiRate, setCdiRate] = useState(0);
  const [projecaoSemana, setProjecaoSemana] = useState(0);
  const [projecaoMes, setProjecaoMes] = useState(0);
  const [rendimentoSemana, setRendimentoSemana] = useState(0);
  const [rendimentoMes, setRendimentoMes] = useState(0);
  const [rendimentoLiquidoSemana, setRendimentoLiquidoSemana] = useState(0);
  const [rendimentoLiquidoMes, setRendimentoLiquidoMes] = useState(0);
  const [projecaoAno, setProjecaoAno] = useState(0);
  const [projecaoCincoAnos, setProjecaoCincoAnos] = useState(0);
  const [projecaoDezAnos, setProjecaoDezAnos] = useState(0);
  const [rendimentoLiquidoAno, setRendimentoLiquidoAno] = useState(0);
  const [rendimentoLiquidoCincoAnos, setRendimentoLiquidoCincoAnos] =
    useState(0);
  const [rendimentoLiquidoDezAnos, setRendimentoLiquidoDezAnos] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchCdiRate = async () => {
      try {
        const response = await fetch(
          "https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json"
        );
        const data = await response.json();
        const latestCdi = data[data.length - 1].valor;
        setCdiRate(latestCdi / 30);
      } catch (error) {
        console.error("Error fetching CDI rate:", error);
      }
    };

    const loadStoredData = async () => {
      try {
        const storedAmount = await AsyncStorage.getItem("currentAmount");
        if (storedAmount !== null) {
          setCurrentAmount(parseFloat(storedAmount));
        }
      } catch (error) {
        console.error("Error loading stored data:", error);
      }
    };

    fetchCdiRate();
    loadStoredData();
  }, []);

  useEffect(() => {
    const updateAmount = async () => {
      if (currentAmount > 0 && cdiRate > 0) {
        const newAmount = currentAmount + currentAmount * (cdiRate / 100);
        setCurrentAmount(newAmount);
        await AsyncStorage.setItem("currentAmount", newAmount.toString());
      }
    };

    const interval = setInterval(updateAmount, 24 * 60 * 60 * 1000); // Update every 24 hours

    return () => clearInterval(interval);
  }, [currentAmount, cdiRate]);

  useEffect(() => {
    if (currentAmount > 0 && cdiRate > 0) {
      calcularProjecoes(currentAmount);
    }
  }, [currentAmount, cdiRate]);

  const handleInvest = () => {
    const amount = parseFloat(investedAmount);
    const contribution = parseFloat(monthlyContribution);
    if (!isNaN(amount)) {
      setCurrentAmount(amount);
      AsyncStorage.setItem("currentAmount", amount.toString());
      calcularProjecoes(amount, contribution);
    }
  };

  const calcularProjecoes = (amount, contribution = 0) => {
    const cdiDiario = cdiRate / 100;
    const rendimentoSemana = amount * cdiDiario * 5; // 5 dias úteis
    const rendimentoMes = amount * cdiDiario * 21; // 21 dias úteis
    const projecaoSemana = amount + rendimentoSemana;
    const projecaoMes = amount + rendimentoMes;

    const impostoSemana = rendimentoSemana * 0.225; // 22.5% para até 180 dias
    const impostoMes = rendimentoMes * 0.225; // 22.5% para até 180 dias

    const rendimentoLiquidoSemana = rendimentoSemana - impostoSemana;
    const rendimentoLiquidoMes = rendimentoMes - impostoMes;

    setRendimentoSemana(rendimentoSemana.toFixed(2));
    setRendimentoMes(rendimentoMes.toFixed(2));
    setProjecaoSemana(projecaoSemana.toFixed(2));
    setProjecaoMes(projecaoMes.toFixed(2));
    setRendimentoLiquidoSemana(rendimentoLiquidoSemana.toFixed(2));
    setRendimentoLiquidoMes(rendimentoLiquidoMes.toFixed(2));

    // Projeções para 1 ano, 5 anos e 10 anos
    const rendimentoAno = calcularRendimentoComAportes(
      amount,
      contribution,
      252
    ); // 252 dias úteis
    const rendimentoCincoAnos = calcularRendimentoComAportes(
      amount,
      contribution,
      252 * 5
    ); // 5 * 252 dias úteis
    const rendimentoDezAnos = calcularRendimentoComAportes(
      amount,
      contribution,
      252 * 10
    ); // 10 * 252 dias úteis

    const impostoAno = rendimentoAno * 0.175; // 17.5% para 361 a 720 dias
    const impostoCincoAnos = rendimentoCincoAnos * 0.15; // 15% para acima de 720 dias
    const impostoDezAnos = rendimentoDezAnos * 0.15; // 15% para acima de 720 dias

    const rendimentoLiquidoAno = rendimentoAno - impostoAno;
    const rendimentoLiquidoCincoAnos = rendimentoCincoAnos - impostoCincoAnos;
    const rendimentoLiquidoDezAnos = rendimentoDezAnos - impostoDezAnos;

    setProjecaoAno((amount + rendimentoLiquidoAno).toFixed(2));
    setProjecaoCincoAnos((amount + rendimentoLiquidoCincoAnos).toFixed(2));
    setProjecaoDezAnos((amount + rendimentoLiquidoDezAnos).toFixed(2));
    setRendimentoLiquidoAno(rendimentoLiquidoAno.toFixed(2));
    setRendimentoLiquidoCincoAnos(rendimentoLiquidoCincoAnos.toFixed(2));
    setRendimentoLiquidoDezAnos(rendimentoLiquidoDezAnos.toFixed(2));
  };

  const calcularRendimentoComAportes = (amount, contribution, days) => {
    let total = amount;
    const cdiDiario = cdiRate / 100;
    for (let i = 0; i < days; i++) {
      total += total * cdiDiario;
      if ((i + 1) % 21 === 0) {
        // Adiciona o aporte mensal a cada 21 dias úteis
        total += contribution;
      }
    }
    return total - amount;
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const renderSelectedOption = () => {
    switch (selectedOption) {
      case "1 Semana":
        return (
          <>
            <Text style={styles.result}>
              Projeção para 1 Semana: {formatCurrency(projecaoSemana)}
            </Text>
            <Text style={styles.result}>
              Rendimento para 1 Semana: {formatCurrency(rendimentoSemana)}
            </Text>
            <Text style={styles.result}>
              Rendimento Líquido para 1 Semana:{" "}
              {formatCurrency(rendimentoLiquidoSemana)} (descontando o imposto
              de renda sobre o lucro)
            </Text>
          </>
        );
      case "1 Mês":
        return (
          <>
            <Text style={styles.result}>
              Projeção para 1 Mês: {formatCurrency(projecaoMes)}
            </Text>
            <Text style={styles.result}>
              Rendimento para 1 Mês: {formatCurrency(rendimentoMes)}
            </Text>
            <Text style={styles.result}>
              Rendimento Líquido para 1 Mês:{" "}
              {formatCurrency(rendimentoLiquidoMes)} (descontando o imposto de
              renda sobre o lucro)
            </Text>
          </>
        );
      case "1 Ano":
        return (
          <>
            <Text style={styles.result}>
              Projeção para 1 Ano: {formatCurrency(projecaoAno)}
            </Text>
            <Text style={styles.result}>
              Rendimento Líquido para 1 Ano:{" "}
              {formatCurrency(rendimentoLiquidoAno)} (descontando o imposto de
              renda sobre o lucro)
            </Text>
          </>
        );
      case "5 Anos":
        return (
          <>
            <Text style={styles.result}>
              Projeção para 5 Anos: {formatCurrency(projecaoCincoAnos)}
            </Text>
            <Text style={styles.result}>
              Rendimento Líquido para 5 Anos:{" "}
              {formatCurrency(rendimentoLiquidoCincoAnos)} (descontando o
              imposto de renda sobre o lucro)
            </Text>
          </>
        );
      case "10 Anos":
        return (
          <>
            <Text style={styles.result}>
              Projeção para 10 Anos: {formatCurrency(projecaoDezAnos)}
            </Text>
            <Text style={styles.result}>
              Rendimento Líquido para 10 Anos:{" "}
              {formatCurrency(rendimentoLiquidoDezAnos)} (descontando o imposto
              de renda sobre o lucro)
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
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
      {renderSelectedOption()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
