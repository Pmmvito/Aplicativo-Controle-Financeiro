// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Picker } from '@react-native-picker/picker';
// import { Ionicons } from '@expo/vector-icons'; // Para o ícone de seta

// export default function AddDespesas({ route }) {
//   const navigation = useNavigation();
//   const { despesa } = route.params || {};

//   const [icon, setIcon] = useState(despesa ? despesa.icon : '');
//   const [title, setTitle] = useState(despesa ? despesa.title : '');
//   const [description, setDescription] = useState(despesa ? despesa.description : '');
//   const [value, setValue] = useState(despesa ? despesa.value.toString() : '');
//   const [status, setStatus] = useState(despesa ? despesa.status : 'Active');
//   const [date, setDate] = useState(despesa ? despesa.date : '');
//   const [tags, setTags] = useState(despesa ? despesa.tags.join(', ') : '');

//   const handleSave = () => {
//     console.log('Despesa salva:', { icon, title, description, value, status, date, tags });
//     navigation.goBack();
//   };

//   const handleDelete = () => {
//     console.log('Despesa deletada:', { icon, title, description, value, status, date, tags });
//     navigation.goBack();
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//         <Ionicons name="arrow-back" size={24} color="white" />
//         <Text style={styles.backButtonText}>Voltar</Text>
//       </TouchableOpacity>
      
//       <Text style={styles.title}>Adicionar Despesa</Text>
      
//       <View style={styles.iconContainer}>
//         <Icon name={icon || 'minus'} size={30} color="#333" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Ícone (nome do ícone)"
//           value={icon}
//           onChangeText={setIcon}
//         />
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Título"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Descrição"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Valor"
//         keyboardType="numeric"
//         value={value}
//         onChangeText={setValue}
//       />
//       <Picker
//         selectedValue={status}
//         style={styles.picker}
//         onValueChange={(itemValue) => setStatus(itemValue)}
//       >
//         <Picker.Item label="Ativo" value="Active" />
//         <Picker.Item label="Inativo" value="Inactive" />
//       </Picker>
//       <TextInput
//         style={styles.input}
//         placeholder="Data (YYYY-MM-DD)"
//         value={date}
//         onChangeText={setDate}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Tags (separadas por vírgula)"
//         value={tags}
//         onChangeText={setTags}
//       />

//       <View style={styles.buttonContainer}>
//         <Button title="Salvar" onPress={handleSave} color="#4CAF50" />
//         {despesa && <Button title="Deletar" onPress={handleDelete} color="#F44336" />}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     justifyContent: 'center', // Centraliza verticalmente
//     alignItems: 'center', // Centraliza horizontalmente
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     height: 50,
//     width: '100%', // O input agora ocupará 100% da largura do container
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   picker: {
//     height: 50,
//     width: '100%', // O picker também ocupará 100% da largura do container
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 15,
//     backgroundColor: '#fff',
//     fontSize: 16,
//   },
//   buttonContainer: {
//     width: '100%',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   backButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     backgroundColor: '#2196F3',
//     padding: 10,
//     borderRadius: 10,
//     elevation: 2,
//     width: '100%',
//   },
//   backButtonText: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 10,
//   },
// });
