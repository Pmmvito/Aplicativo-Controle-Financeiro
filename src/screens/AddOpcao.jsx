// src/screens/AddOpcao.js
import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AddOpcao = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const navigateToCalcularJurosCompostos = () => {
    setModalVisible(false);
    navigation.navigate("CalcularJurosCompostos");
  };

  const navigateToCalcularJurosSimples = () => {
    setModalVisible(false);
    navigation.navigate("CalcularJurosSimples");
  };

  const navigateToAcompanharRendimentoCdi = () => {
    setModalVisible(false);
    navigation.navigate("AcompanharRendimentoCdi");
  };

  return (
    <View style={styles.container}>
      {/* Botão Flutuante Central */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <AntDesign name="calculator" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal com opções */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={navigateToCalcularJurosCompostos} style={styles.menuItem}>
              <Text style={styles.menuText}>Calculadora de Juros Composto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToCalcularJurosSimples} style={styles.menuItem}>
              <Text style={styles.menuText}>Calculadora de Juros Simples</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToAcompanharRendimentoCdi} style={styles.menuItem}>
              <Text style={styles.menuText}>Acompanhar Rendimento CDI</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#7b147b",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: "#7b147b",
    borderRadius: 10,
    padding: 30,
    width: 300,
    alignItems: "center",
  },
  menuItem: {
    marginBottom: 10,
  },
  menuText: {
    color: "white",
    fontSize: 20,
  },
});

export default AddOpcao;
