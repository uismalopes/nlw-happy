import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import iconSuccess from '../images/icon-success.png';

export default function Success(){
    const navigation = useNavigation();
    function handleNavigate(){
        navigation.navigate('OrphanagesMap');
    }
    return(
        <View style={ styles.container }>
            <Image source={iconSuccess} />
            <Text style={styles.title}>Ebaaa!</Text>
            <Text style={ styles.subtext}>
                O cadastro deu certo e foi
                enviado ao administrador para ser
                aprovado. Agora é só esperar :) 
            </Text>
            <RectButton style={ styles.button } onPress={handleNavigate}>
                <Text style={styles.buttonText}>Ok</Text>
            </RectButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#39CC83',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 40,
        fontFamily: 'Nunito_800ExtraBold',
        color: '#fff',
        marginVertical: 18
    },
    subtext: {
        fontSize: 20,
        color: '#fff',
        fontFamily: 'Nunito_600SemiBold',
        width: 315,
        textAlign: 'center',
    },
    button: {
        width: 120,
        height: 56,
        backgroundColor: '#19C06D',
        borderRadius: 20,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 15
    }
});