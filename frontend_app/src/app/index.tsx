import { View, Image, Text } from 'react-native';
import React, { useEffect } from 'react';
import { router } from 'expo-router';

const Splash = () => {
    useEffect(() => {
        // Redirect to login after 5 seconds
        const timer = setTimeout(() => {
            router.replace('/auth/login');
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            {/* <Image
                source={require('../assets/splash.png')} // Add your splash image to assets folder
                style={{ width: 200, height: 200 }}
                resizeMode="contain"
            /> */}
            <Text>Welcome</Text>
        </View>
    );
};

export default Splash; 