import { View, Text, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";



function OrderDetailScreen(){

    const navigation = useNavigation();
    const route = useRoute();
    const {order_id} = route.params|| {};

    const [order, setOrder] = useState<any>(null)

    useEffect(()=>{

    },[order_id])

    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default OrderDetailScreen