import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CalcularJurosCompostos = () => {
    const navigation = useNavigation();
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [months, setMonths] = useState('');
    const [monthlyContribution, setMonthlyContribution] = useState('');
    const [result, setResult] = useState(null);

    const calculateCompoundInterest = () => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100 / 12;
        const n = parseInt(months);
        const C = parseFloat(monthlyContribution);

        let total = P;
        for (let i = 0; i < n; i++) {
            total = (total + C) * (1 + r);
        }

        setResult(total.toFixed(2));
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Calculadora de Juros Compostos</Text>
            <View style={styles.inputContainer}>

                <Text style={styles.label}>Capital Inicial:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={principal}
                    onChangeText={setPrincipal}
                    placeholder="Ex: 1000"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Taxa de Juros Anual (%):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={rate}
                    onChangeText={setRate}
                    placeholder="Ex: 5"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Período (meses):</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={months}
                    onChangeText={setMonths}
                    placeholder="Ex: 12"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Aporte Mensal:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    placeholder="Ex: 100"
                />
            </View>
            <TouchableOpacity style={styles.calculateButton} onPress={calculateCompoundInterest}>
                <Text style={styles.calculateButtonText}>Calcular</Text>
            </TouchableOpacity>
            {result !== null && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Resultado: R$ {result}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f4f7',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    calculateButton: {
        backgroundColor: '#7b147b',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    calculateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#e0e4e5',
        borderRadius: 8,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
});

export default CalcularJurosCompostos;
