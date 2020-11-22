import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const { Navigator, Screen } = createStackNavigator();

import OrphanagesMap from '../pages/OrphanagesMap';
import OrphanageDetails from '../pages/OrphanageDetails';

import SelectMapPosition from '../pages/CreateOrphanage/SelectMapPosition';
import OrphanageData from '../pages/CreateOrphanage/OrphanageData';
import Header from '../components/Header';
import AsyncStorage from '@react-native-community/async-storage';
import OnboardingScreen from '../pages/OnboardingScreen';
import Success from '../pages/Success';

export default function Routes(){
    const [completeOnboarding, setCompleteOnboarding] = useState<boolean | null>(null);

    useEffect(()=>{
        async function checkOnboarding(){
            const storageOnboarding = await AsyncStorage.getItem('@alreadyLaunched');
            if(storageOnboarding) {
                const { complete } = JSON.parse(storageOnboarding);
                setCompleteOnboarding(complete);
            }else {
                setCompleteOnboarding(false);
            }
        }
        checkOnboarding();
    }, []);

    if(completeOnboarding === null) {
        return null;
    }

    return(
        <NavigationContainer>
            <Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#f2f3f5'} }}>
                { !completeOnboarding && <Screen 
                name="Onboarding" 
                component={OnboardingScreen} /> }

                <Screen 
                name="OrphanagesMap" 
                component={OrphanagesMap} />

                <Screen 
                name="OrphanageDetails" 
                component={OrphanageDetails} 
                options={{
                    headerShown: true,
                    header: ()=> <Header showCancel={false} title="Orfanato" />
                }}
                />

                <Screen 
                name="SelectMapPosition" 
                component={SelectMapPosition} 
                options={{
                    headerShown: true,
                    header: ()=> <Header title="Selecione no mapa" />
                }}
                />

                <Screen 
                name="OrphanageData" 
                component={OrphanageData} 
                options={{
                    headerShown: true,
                    header: ()=> <Header title="Informe os dados" />
                }}
                />

                <Screen
                name="Success"
                component={ Success }
                />

            </Navigator>
        </NavigationContainer>
    );
}