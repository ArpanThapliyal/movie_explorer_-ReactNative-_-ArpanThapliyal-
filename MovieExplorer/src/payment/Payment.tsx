import { SafeAreaView, Alert } from 'react-native';
import React, { useState } from 'react';
import WebView from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { checkSubscriptionStatus } from '../axiosRequest/axiosRequest';
import { useSelector } from 'react-redux';

type PaymentRouteParams = {
  params: {
    url: string;
    session: string;
  };
};

const Payment = () => {
  const route = useRoute<RouteProp<PaymentRouteParams, 'params'>>();
  const { url, session } = route.params;
  const navigation = useNavigation();
  const user_token = useSelector((state: any) => state.user.token);

  const [hasProcessed, setHasProcessed] = useState(false);

  const handleNavigationChange = async(navState:any) => {
    const currentUrl = navState.url;
    console.log('Current URL:', currentUrl);

    // Prevent multiple processing
    if (hasProcessed) return;

    // Handle success URL
    if(currentUrl.includes('success')) {
      console.log('Success URL reached:', currentUrl);
      setHasProcessed(true);
      
      try {
        const res = await checkSubscriptionStatus(user_token);
        console.log(`Your plan type:`, res);
        
        if (res?.status === 200) {
          console.log('Subscription status fetched successfully');
          navigation.replace('MainTabs');
        } else {
          console.error('Failed to fetch subscription status:', res);
          Alert.alert(
            "Subscription Error",
            "Your payment was successful, but we couldn't verify your subscription."
          );
          
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        Alert.alert(
          "Subscription Error",
          "Your payment was successful, but there was an error updating your subscription."
        );
      }
    }
    // Handle cancel or failure URL
    else if(currentUrl.includes('cancel') || currentUrl.includes('failure')) {
      console.log("Payment canceled or failed");
      setHasProcessed(true);
      Alert.alert(
        "Payment Unsuccessful",
        "Your payment was not completed."
      );
      navigation.replace('MainTabs');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }} testID="payment-screen">
      <WebView
        source={{ uri: url }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        onNavigationStateChange={handleNavigationChange}
      />
    </SafeAreaView>
  );
};

export default Payment;