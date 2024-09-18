import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CalcularJurosSimples = () => {
    const navigation = useNavigation();
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [result, setResult] = useState('');

    const calculateCompoundInterest = () => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(time);
        const A = P * Math.pow((1 + r), t);
        setResult(A.toFixed(2));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Calculadora de Juros Simples</Text>

            <TextInput
                style={styles.input}
                placeholder="Valor Inicial"
                keyboardType="numeric"
                value={principal}
                onChangeText={setPrincipal}
            />
            <TextInput
                style={styles.input}
                placeholder="Taxa Mensal (%)"
                keyboardType="numeric"
                value={rate}
                onChangeText={setRate}
            />
            <TextInput
                style={styles.input}
                placeholder="Período (Meses)"
                keyboardType="numeric"
                value={time}
                onChangeText={setTime}
            />

            <TouchableOpacity style={styles.calculateButton} onPress={calculateCompoundInterest}>
                <Text style={styles.calculateButtonText}>Calcular</Text>
            </TouchableOpacity>

            {result && !isNaN(time) ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Em {time} meses você terá: R$ {result}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    backButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#7b147b',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
        marginBottom: 20,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    calculateButton: {
        width: '100%',
        backgroundColor: '#7b147b',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#e6f7ff',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CalcularJurosSimples;
