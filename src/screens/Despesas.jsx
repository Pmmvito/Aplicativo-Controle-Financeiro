import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles";
import CardItem from "../components/CardItem";

export default function Despesas({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Despesas</Text>
      <CardItem
        icon="shoppingcart"
        title="Compra no Mercado"
        description="Compras realizadas no mercado"
        value="R$ 250,00"
        status="Não Pago"
        date="12/09/2024"
        tags={["Alimentos", "Supermercado"]}
      />
    </View>
  );
}
