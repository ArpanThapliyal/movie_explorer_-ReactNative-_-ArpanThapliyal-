import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/dashboardHeader';
import Body from '../components/dashboardBody';
import Footer from '../components/dashboardFooter';

const { width, height } = Dimensions.get('screen');
const dashboard = () => {
  return (
      <View style={styles.container}>
      <ScrollView  keyboardShouldPersistTaps="handled">
        <Header/>
        <Body/>
      </ScrollView>
        <View style={styles.foot}>
          <Footer/>
        </View>
      </View>
  )
}

export default dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.03,
  },
  foot:{
    paddingHorizontal: width * 0.04,
    position:'absolute',
    marginTop:"195%",
    width:'109%'
  }
})