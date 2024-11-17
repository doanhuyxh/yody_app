import { Text, View, Button } from 'react-native';
import { useState } from 'react';
import { WebView } from 'react-native-webview';
import axios from 'axios';

function CheckOutScreen() {
  // Declare state variables
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<string | null>(null);
  
  // Initiate payment request
  const initiatePayment = async (totalPrice: number) => {
    console.log("Da goi")
    try {
      const response = await axios.post(
        'https://vnpay.lokid.xyz/api/vnpay-payment',
        { total_price: totalPrice }
      );
      
      const paymentUrl = response.data.data;
      if (paymentUrl) {
        setPaymentUrl(paymentUrl);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
    }
  };

  // Default total price for testing
  const totalPrice = 100000;

  return (
    <View style={{ flex: 1 }}>
      {/* Payment button */}
      <Button title="Pay Now" onPress={() => initiatePayment(totalPrice)} />
      
      {/* Display WebView if payment URL is available */}
      {paymentUrl && (
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={(state) => {
            // Check if callback URL is hit (after payment completion)
            if (state.url.includes('yody.lokid.xyz/payment')) {
              const urlParams = new URLSearchParams(state.url.split('?')[1]);
              const vnpResponseCode = urlParams.get('vnp_ResponseCode');
              const message = vnpResponseCode === '00' ? 'Payment Success' : 'Payment Failed';
              setPaymentResult(message);
            }
          }}
        />
      )}

      {/* Show payment result */}
      {paymentResult && <Text>{paymentResult}</Text>}
    </View>
  );
}

export default CheckOutScreen;
