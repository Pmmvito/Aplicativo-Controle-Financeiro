import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const Dicas = () => {
    const [cdi, setCdi] = useState(null);
    const [selic, setSelic] = useState(null);
    const [exchangeRates, setExchangeRates] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const cdiResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados?formato=json');
            const cdiData = await cdiResponse.json();
            const selicResponse = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.4390/dados?formato=json');
            const selicData = await selicResponse.json();
            const exchangeResponse = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
            const exchangeData = await exchangeResponse.json();

            const latestCdi = cdiData[cdiData.length - 1];
            const latestSelic = selicData[selicData.length - 1];

            setCdi(latestCdi ? latestCdi.valor : 'N/A');
            setSelic(latestSelic ? latestSelic.valor : 'N/A');
            setExchangeRates(exchangeData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#00796b" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.header}>Indicadores Financeiros</Text>

                {/* Card CDI */}
                <View style={styles.card}>
                    <Text style={styles.label}>CDI</Text>
                    <Text style={styles.value}>{cdi}</Text>
                    <MaterialIcons name="trending-up" size={20} color="#00796b" />
                </View>

                {/* Card Selic */}
                <View style={styles.card}>
                    <Text style={styles.label}>Selic</Text>
                    <Text style={styles.value}>{selic}</Text>
                    <FontAwesome5 name="percentage" size={20} color="#00796b" />
                </View>

                {/* Cards de câmbio */}
                {exchangeRates && (
                    <>
                        {/* Card USD/BRL */}
                        <View style={styles.card}>
                            <Text style={styles.label}>USD/BRL</Text>
                            <Text style={styles.value}>{exchangeRates.USDBRL.bid}</Text>
                            <FontAwesome5 name="dollar-sign" size={20} color="#00796b" />
                        </View>

                        {/* Card EUR/BRL */}
                        <View style={styles.card}>
                            <Text style={styles.label}>EUR/BRL</Text>
                            <Text style={styles.value}>{exchangeRates.EURBRL.bid}</Text>
                            <FontAwesome5 name="euro-sign" size={20} color="#00796b" />
                        </View>

                        {/* Card BTC/BRL */}
                        <View style={styles.card}>
                            <Text style={styles.label}>BTC/BRL</Text>
                            <Text style={styles.value}>{exchangeRates.BTCBRL.bid}</Text>
                            <FontAwesome5 name="bitcoin" size={20} color="#00796b" />
                        </View>
                    </>
                )}

                {/* Dicas Financeiras */}
                <Text style={styles.header}>Dicas Financeiras</Text>
                <View style={styles.dicasContent}>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>1. Diversifique seus investimentos: Evite concentrar todo o capital em um único ativo para reduzir riscos.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>2. Controle seus gastos: Manter um controle dos seus gastos mensais ajuda a não extrapolar o orçamento.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>3. Tenha uma reserva de emergência: Um fundo de emergência para cobrir 6 meses de despesas é essencial para imprevistos.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>4. Invista em conhecimento: Estude sobre diferentes tipos de investimentos e como eles funcionam antes de aplicar seu dinheiro.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>5. Cuidado com o crédito fácil: Evite financiamentos e empréstimos a juros altos, eles podem comprometer seu orçamento a longo prazo.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>6. Aproveite os juros compostos: Comece a investir cedo, mesmo com valores baixos, para aproveitar o poder dos juros compostos ao longo do tempo.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>7. Revise periodicamente seu orçamento: Faça ajustes no seu orçamento mensal conforme suas prioridades e condições financeiras mudam.</Text>
                    </View>
                    <View style={styles.tipContainer}>
                        <Text style={styles.tipText}>8. Pague suas dívidas o quanto antes: Dívidas acumulam juros, então se livrar delas deve ser uma prioridade para evitar que cresçam.</Text>
                    </View>
                </View>

                {/* Espaço em branco abaixo */}
                <View style={styles.spacer} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#e0f7fa',
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00796b',
        marginVertical: 15,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        width: width * 0.85,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#004d40',
    },
    value: {
        fontSize: 18,
        color: '#00796b',
    },
    dicasContent: {
        width: '100%',
        marginTop: 15,
        marginBottom: 20, // Adicione margem inferior se necessário
    },
    tipContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    tipText: {
        fontSize: 16,
        color: '#004d40',
        lineHeight: 22,
    },
    spacer: {
        height: 100, // Ajuste a altura do espaço conforme necessário
    },
});

export default Dicas;
