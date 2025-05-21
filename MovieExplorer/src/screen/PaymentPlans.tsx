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
import { useSelector } from 'react-redux';
import { createSubscription } from '../axiosRequest/axiosRequest';

const { height, width } = Dimensions.get('window');

export default function PaymentPlans({ navigation }:any) {
  const plans = [
    {
      price: '£3.00',
      subtitle: '1 Day Access',
      tagline: 'Enjoy Free Perks For a Day /-',
      features: [
        'Only 1 Movie Every Week',
        'Change Wallpapers Automatically',
        'Quality Upto 480p',
      ],
      planType: '1_day',
    },
    {
      price: '£89.00',
      subtitle: 'Monthly Access',
      tagline: 'Free Perks For a Month Only /-',
      features: [
        'No Ads',
        'Access For A Month Only',
        'Access All Non-Premium Movies',
        'Change Wallpapers Automatically',
        'Faster Browsing',
      ],
      planType: '1_month',
    },
    {
      price: '£259.00',
      subtitle: '3 month Access',
      tagline: 'Pay Once, Enjoy For 3 months',
      features: [
        'No Ads',
        'Access Valid For A Year',
        'Acess All Movies',
        'HD Quality',
        'Download Upto 25GB of Movies',
        'Faster Browsing',
      ],
      planType: '3_months',
    },
  ];

  const user_token = useSelector(state => state.user.token);
  const plan_type = useSelector(state => state.subscription.plan_type);
  const updated_at = useSelector(state => state.subscription.updated_at);
  const expires_at = useSelector(state => state.subscription.expires_at);

  let planDuration = null;
  if (plan_type === 'premium' && updated_at && expires_at) {
    const updatedAt = new Date(updated_at);
    const expiresAt = new Date(expires_at);
    const msInDay = 1000 * 60 * 60 * 24;
    const diffDays = Math.round((expiresAt - updatedAt) / msInDay);

    console.log("your duration : ", diffDays);

    if (diffDays >= 1 && diffDays < 30) {
      planDuration = '1_day';
    } else if (diffDays >= 30 && diffDays < 90) {
      planDuration = '1_month';
    } else if (diffDays >= 90) {
      planDuration = '3_months';
    }
  }

  const isPremium = plan_type === 'premium';
  const currentPlan = isPremium ? planDuration : null;

  const handlePayment = async (planType) => {
    const res = await createSubscription(planType, user_token);
    console.log(res);
    const checkOutUrl = res.url;
    const session = res.session_id;
    navigation.navigate('Payment', { url: checkOutUrl, session: session });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/payment/img1.jpg')} style={styles.headerImage} />
      <ScrollView style={styles.AllPlans} horizontal={true}>
        {plans.map((plan, index) => {
          const isCurrentPlan = plan.planType === currentPlan;
          const isDisabled = isPremium;
          return (
            <View key={index} style={[styles.card, isCurrentPlan && styles.currentPlanCard]}>
              {isCurrentPlan && (
                <View style={styles.ribbon}>
                  <Text style={styles.ribbonText}>Current Plan</Text>
                </View>
              )}
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.subtitle}>{plan.subtitle}</Text>
              <Text style={styles.tagline}>{plan.tagline}</Text>
              <View style={styles.features}>
                {plan.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Image source={require('../assets/payment/plus.png')} style={styles.checkIcon} />
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                style={[styles.button, isDisabled && styles.disabledButton]}
                activeOpacity={0.5}
                onPress={() => !isDisabled && handlePayment(plan.planType)}
                disabled={isDisabled}
              >
                <Text style={styles.buttonText}>
                  {isCurrentPlan ? 'Your Current Plan' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
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
    height: height * 0.32,
    resizeMode: 'cover',
  },
  AllPlans: {
    marginTop: -width * 0.52,
  },
  card: {
    width: width * 0.88,
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 24,
    alignSelf: 'center',
    elevation: 10,
    borderWidth: 1,
    borderColor: 'grey', 
    marginHorizontal: 10,
  },
  currentPlanCard: {
    borderColor: '#FFD700', 
    borderWidth: 3,
    backgroundColor: '#1C2526', 
  },
  ribbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700', // Gold ribbon
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 5,
    borderTopRightRadius:10
  },
  ribbonText: {
    color: '#000',
    fontSize: RFValue(12.5),
    fontWeight: 'bold',
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
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: RFValue(14),
    marginTop: RFValue(20),
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: RFValue(18),
    fontWeight: '600',
  },
});