import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import mapMarker from '../images/map-marker.png';

export default function Loading(){
    return(
        <LinearGradient
        colors={[ '#15D6D6', '#15B6D6']}
        style={styles.container}
        >
            <Image source={mapMarker} style={styles.logo} />
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.title}>Carregando...</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 120,
        height: 140
    },
    title: {
        fontSize: 20,
        fontFamily: 'Nunito_700Bold',
        color: '#fff'
    },
    containerLoading: {
        marginVertical: 20
    }
});