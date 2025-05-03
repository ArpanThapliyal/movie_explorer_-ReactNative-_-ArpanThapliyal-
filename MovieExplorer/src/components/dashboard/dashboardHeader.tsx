
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('screen');

const Header = () => (
  <View style={styles.container}>
    {/* top header */}
    <View style={[styles.rowDirection, styles.topHeaderSpacing]}>
      <Text style={[styles.primaryText, { fontSize: RFValue(36) }]}>
        Home
      </Text>
      <View style={styles.rowDirection}>
        <TouchableOpacity>
          <Image
            source={require('../../assets/header/search.png')}
            style={styles.img}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../../assets/header/profile.png')}
            style={styles.img}
          />
        </TouchableOpacity>
      </View>
    </View>
    
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.04,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',  
  },
  img: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#FFFFFF',
    marginLeft: width * 0.05,
    marginTop: height * 0.02,
  },
  rowDirection: {
    flexDirection: 'row',
  },
  topHeaderSpacing: {
    justifyContent: 'space-between',
  },
});
