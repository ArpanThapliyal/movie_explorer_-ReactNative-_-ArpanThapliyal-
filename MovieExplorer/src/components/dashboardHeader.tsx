import React from 'react';
import { StyleSheet, Text, View,Dimensions, Image, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('screen');

const header = () => {

  return (
    <View style={styles.container}>
      {/* top header */}
      <View style={[styles.rowDirection,styles.topHeaderSpacing]}>
        <View>
          <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>Home</Text>
        </View>
        <View style={styles.rowDirection}>
          <TouchableOpacity>
            <Image
            source={require('../asserts/header/search.png')}
            style={styles.img}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
            source={require('../asserts/header/profile.png')}
            style={styles.img}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* below header */}
      <View style={[styles.rowDirection,styles.bottomHeaderSpacing]}>
        <TouchableOpacity>
          <Text style={[styles.secondaryText, { fontSize: RFValue(16) }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.secondaryText, { fontSize: RFValue(16) }]}>Movies</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.secondaryText, { fontSize: RFValue(16) }]}>Series</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.secondaryText, { fontSize: RFValue(16) }]}>Drama</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  )
}

export default header;

const styles = StyleSheet.create({
  container:{},
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  img:{
    height:25,
    width:25,
    tintColor:'#FFFFFF',
    marginLeft:22,
    marginTop:16
  },
  rowDirection:{
    flexDirection:'row',
  },
  topHeaderSpacing:{
    justifyContent:'space-between',
  },
  bottomHeaderSpacing:{
    marginTop:15,
    gap:20
  },
  secondaryText: {
    color: '#9CA3AF',
    fontWeight:'bold'
  },

})