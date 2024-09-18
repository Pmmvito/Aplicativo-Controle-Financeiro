// src/components/ReceitaCard.js
import React from 'react';
import CardBase from './CardItem';
import styles from '../styles/styles';

const ReceitaCard = (props) => {
  return (
    <CardBase
      {...props}
      cardStyle={styles.receitaCard}
      valueStyle={styles.receitaValue}
    />
  );
};

export default ReceitaCard;
