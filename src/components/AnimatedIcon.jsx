import React, { useEffect, useState } from 'react';
import { View, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AnimatedIcon = ({ name, color, size }) => {
  const [scale] = useState(new Animated.Value(1));

  const animateIcon = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.5, // Aumenta o tamanho para dar o efeito de "bolha"
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1, // Retorna ao tamanho normal
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    animateIcon(); // Anima sempre que o componente for renderizado
  }, []);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(128, 0, 128, 0.3)', // Bolha roxa
        }}
      >
        <Icon name={name} color={color} size={size} />
      </View>
    </Animated.View>
  );
};

export default AnimatedIcon;
