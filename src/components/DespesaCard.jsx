// src/components/DespesaCard.js
import React from 'react';
import CardBase from './CardItem';
import styles from '../styles/styles';

const DespesaCard = (props) => {
  return (
    <CardBase
      {...props}
      cardStyle={styles.despesaCard}
      valueStyle={styles.despesaValue}
    />
  );
};

export default DespesaCard;
