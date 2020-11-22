import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Onboarding, { DotProps, NextButtonProps, DoneButtonProps } from 'react-native-onboarding-swiper';
import iconPlanet from '../images/onboarding-planet.png';
import iconChildren from '../images/icon-children.png';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function OnboardingScreen(){
    const navigation = useNavigation();
    
    async function completeOnboarding(){
        await AsyncStorage.setItem('@alreadyLaunched', JSON.stringify({ complete: true }));
        navigation.navigate('OrphanagesMap');
    }

    const DoneButton = ({ ...props }: DoneButtonProps)=> {
        return(
            <RectButton
            {...props}
            style={styles.nextButton}
            >
                <Feather name="check" size={25} color="#15C3D6" />
            </RectButton>
        )
    }

    const NextButton = ({ isLight, ...props }: NextButtonProps)=>(
        <RectButton
        {...props}
        style={styles.nextButton}
        >
            <Feather name="arrow-right" size={25} color="#15C3D6" />
        </RectButton>
    );

    const Square = ({ selected }: DotProps) =>{
        let backgroundColor = selected ? '#FFD152' : '#BECFD8';
        
        return(
            <View
            style={{
                width: selected ? 16 : 8,
                height: 4,
                marginHorizontal: 3,
                borderRadius: 4,
                backgroundColor,
            }}
            />
        );
    }

    return(
        <ScrollView style={styles.container}>
            <Onboarding 
            onDone={completeOnboarding}
            onSkip={completeOnboarding}
            titleStyles={styles.title}
            subTitleStyles={styles.subTitle}
            NextButtonComponent={NextButton}
            DoneButtonComponent={DoneButton}
            DotComponent={Square}
            showSkip={false}
            bottomBarColor="#f2f3f5"
            bottomBarHeight={ 100 }
            pages={[
                {
                    backgroundColor: '#f2f3f5',
                    image: <Image source={iconPlanet} />,
                    title: 'Leve felicidade para o mundo',
                    subtitle: 'Visite orfanatos e mude o dia de muitas crianças.',
                    titleStyles: {
                        lineHeight: 55,
                        fontSize: 48,
                    }
                },
                {
                    backgroundColor: '#f2f3f5',
                    image: <Image source={iconChildren} />,
                    title: 'Escolha um orfanato no mapa e faça uma visita',
                    subtitle: '',
                    titleStyles: {
                        fontSize: 30,
                        lineHeight: 35,
                        textAlign: 'right',
                        width: Dimensions.get('window').width - 80
                    }
                }
            ]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    title: {
        color: '#0089A5',
        fontFamily: 'Nunito_800ExtraBold',
        fontWeight: '800',
        textAlign: "left",
        width: Dimensions.get('window').width - 100
    },
    subTitle: {
        fontSize: 20,
        color: '#5C8599',
        fontFamily: 'Nunito_600SemiBold',
        width: Dimensions.get('window').width - 100,
        textAlign: "left",
    },
    nextButton: {
        backgroundColor: '#D1EDF2',
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
    }
});