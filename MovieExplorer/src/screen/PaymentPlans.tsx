import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'; 

const { height,width } = Dimensions.get('window');

export default function PaymentPlans({ navigation }: any) {
  const features1 = [
    'Only 1 Movie Every Week',
    'Change Wallpapers Automatically',
    'Quality Upto 480p',
  ];
  const features2 = [
    'No Ads',
    'Access For A Month Only',
    'Access All Non-Premium Movies',
    'Change Wallpapers Automatically',
    'Faster Browsing',
  ];
  const features3 = [
    'No Ads',
    'Access Valid For A Year',
    'Acess All Movies',
    'HD Quality',
    'Download Upto 25GB of Movies',
    'Faster Browsing',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header image */}
      <Image source={require('../assets/payment/img1.jpg')} style={styles.headerImage} />

    <ScrollView style={styles.AllPlans} horizontal={true}>
      {/* Price card 1*/}
      <View style={styles.card}>
        <Text style={styles.price}>₹0</Text>
        <Text style={styles.subtitle}>Free</Text>
        <Text style={styles.tagline}>Enjoy For A Month</Text>

        {/* Features */}
        <View style={styles.features}>
          {features1.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Image source={require('../assets/payment/plus.png')} style={styles.checkIcon} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            /* handle payment */
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Price card 2*/}
      <View style={styles.card}>
        <Text style={styles.price}>₹199.00</Text>
        <Text style={styles.subtitle}>Monthly Access</Text>
        <Text style={styles.tagline}>Free Perks Only /-</Text>

        {/* Features */}
        <View style={styles.features}>
          {features2.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Image source={require('../assets/payment/plus.png')} style={styles.checkIcon} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            /* handle payment */
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Price card 3*/}
      <View style={styles.card}>
        <Text style={styles.price}>₹899.00</Text>
        <Text style={styles.subtitle}>Yearly Access</Text>
        <Text style={styles.tagline}>Pay Once, Enjoy For A Year</Text>

        {/* Features */}
        <View style={styles.features}>
          {features3.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Image source={require('../assets/payment/plus.png')} style={styles.checkIcon} />
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => {
            /* handle payment */
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
  },
  headerImage: {
    width,
    height: height*0.32,
    resizeMode: 'cover',
  },
  AllPlans:{
    marginTop: -width*0.52,
  },
  card: {
    width: width * 0.88,
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    alignSelf: 'center',
    elevation: 10,
    borderWidth: 0.5,
    borderColor: 'yellow',
    marginHorizontal:10
    
  },
  price: {
    fontSize: RFValue(36),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: RFValue(18),
    color: '#aaa',
    textAlign: 'center',
    marginTop: RFValue(4),
  },
  tagline: {
    fontSize: RFValue(14),
    color: '#666',
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  features: {
    marginVertical: RFValue(10),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: RFValue(6),
  },
  checkIcon: {
    width: RFValue(20),
    height: RFValue(20),
    tintColor: 'white',
    resizeMode: 'contain',
  },
  featureText: {
    color: '#ccc',
    fontSize: RFValue(15),
    marginLeft: RFValue(10),
    flexShrink: 1,
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingVertical: RFValue(14),
    marginTop: RFValue(20),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: RFValue(18),
    fontWeight: '600',
  },
});
