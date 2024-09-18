import { View, Text } from "react-native";
import CardItem from "../components/CardItem";
import CustomButton from "../components/CustomButton"; // Incluído conforme a necessidade

export default function Receitas({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas</Text>
      <CardItem
        icon="shoppingcart"
        title="Compra no Mercado"
        description="Compras realizadas no mercado"
        value="R$ 250,00"
        status="Não Pago"
        date="12/09/2024"
        tags={["Alimentos", "Supermercado"]}
        style={styles.CardItem} // Aplicando o estilo do item do cartão
      />
      <CustomButton
        onPress={() => console.log("Ação do botão")}
        title="Adicionar Receita"
      />
    </View>
  );
}
