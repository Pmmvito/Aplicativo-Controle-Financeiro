// src/styles/styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Estilos gerais
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#e0f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    color: '#00796b',
    position: 'absolute',
    top: 30,
    alignSelf: 'center',
  },
  userText: {
    fontSize: 20,
    marginBottom: 25,
    color: '#004d40',
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
  },
  buttonContainer: {
    marginVertical: 15,
    width: 220,
    borderRadius: 10,
    backgroundColor: '#004d40',
    overflow: 'hidden',
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
  },
  input: {
    height: 45,
    borderColor: '#004d40',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    width: 260,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 160,
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    backgroundColor: '#f59330',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { height: 2, width: 0 },
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingBottom: 10,
    paddingTop: 10,
    height: 50,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderButton: {
    width: 60,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },

  // Estilos dos cartões
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: '90%',
  },
  iconContainer: {
    marginBottom: 10,
  },
  content: {},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: '#00796b',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f2f1',
    color: '#00796b',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
    fontSize: 12,
  },
  receitaCard: {
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  despesaCard: {
    borderColor: '#f44336',
    borderWidth: 1,
  },
  receitaValue: {
    color: '#4caf50',
  },
  despesaValue: {
    color: '#f44336',
  },
  // Estilo dos botões de ação no cartão
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    padding: 10,
  },

    // Estilos para a barra de navegação
    shadow: {
      shadowColor: '#7b147b',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
    },
    tabButton: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5, // Reduz o padding dos botões
    },
    activeTab: {
      backgroundColor: '#f1e4f5',
      borderRadius: 10,
      padding: 1, // Ajusta o padding do botão ativo
    },
    tabText: {
      fontSize: 10, // Reduz o tamanho do texto
      marginTop: 3, // Ajusta o espaçamento entre o ícone e o texto
    },
});
