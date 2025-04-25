import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Image 
        source={require('../asserts/footer/home.png')}
        style={styles.iconimage}
        />
      </TouchableOpacity>
      <TouchableOpacity>
      <Image 
        source={require('../asserts/footer/search.png')}
        style={styles.iconimage}
        />
      </TouchableOpacity>
      <TouchableOpacity>
      <Image 
        source={require('../asserts/footer/downloads.png')}
        style={styles.iconimage}
        />
      </TouchableOpacity>
      <TouchableOpacity>
      <Image 
        source={require('../asserts/footer/profile.png')}
        style={styles.iconimage}
        />
      </TouchableOpacity>
    </View>
  )
}

export default footer;

const styles = StyleSheet.create({
  container:{
    height:60,
    backgroundColor:'#181819',
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    borderRadius:20
  },
  iconimage:{
    height:25,
    width:25,
    tintColor:'#FFFFFF',
  }

});


