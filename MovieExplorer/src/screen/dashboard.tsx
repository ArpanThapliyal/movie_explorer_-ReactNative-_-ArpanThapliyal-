import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import Header from '../components/dashboard/dashboardHeader';
import Body   from '../components/dashboard/dashboardBody';

const { height } = Dimensions.get('screen');

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Header />
        <Body />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: height * 0.03,
  },
});
