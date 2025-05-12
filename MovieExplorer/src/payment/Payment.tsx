// payment.tsx
import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import {
  initPaymentSheet,
  presentPaymentSheet,
} from '@stripe/stripe-react-native';

export default function CheckoutScreen({ route }) {
  const { amount, currency } = route.params; // e.g. 19900, 'inr'
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // 1. Fetch client secret for this plan
      const resp = await fetch('http://192.168.225.33:3000/payment-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      const { clientSecret, error: fetchError } = await resp.json();
      if (fetchError) throw new Error(fetchError);

      // 2. Initialize the PaymentSheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'MovieApp',
        paymentIntentClientSecret: clientSecret,
      });
      if (initError) throw initError;

      // 3. Present the sheet
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) throw presentError;

      Alert.alert('Success', 'Your payment is confirmed!');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Button
        title={loading ? 'Processing…' : 'Pay Now'}
        onPress={handlePay}
        disabled={loading}
      />
    </View>
  );
}
