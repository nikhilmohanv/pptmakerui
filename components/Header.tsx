import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  credits: number;
}

export const Header = ({ credits }: HeaderProps) => {
  return (
    <View style={styles.header}>
        <Text style={styles.logo}>Presentation AI</Text>
      <Text style={styles.credits}> {credits} credits</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 'auto',
  },
  credits: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0052CC',
  },
});