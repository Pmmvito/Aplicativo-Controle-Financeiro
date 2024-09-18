import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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
        <View style={styles.container}>
            <Text style={styles.text}>CDI: {cdi}</Text>
            <Text style={styles.text}>Selic: {selic}</Text>
            {exchangeRates && (
                <>
                    <Text style={styles.text}>USD/BRL: {exchangeRates.USDBRL.bid}</Text>
                    <Text style={styles.text}>EUR/BRL: {exchangeRates.EURBRL.bid}</Text>
                    <Text style={styles.text}>BTC/BRL: {exchangeRates.BTCBRL.bid}</Text>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        padding: 20,
    },
    text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00796b',
        marginVertical: 10,
    },
});

export default Dicas;
