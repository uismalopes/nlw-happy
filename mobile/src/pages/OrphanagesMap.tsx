import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import api from '../services/api';
import Loading from '../components/Loading';
import getCurrentLocation from '../services/location';

interface Orphanage {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export default function OrphanagesMap(){
    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
    const [ currentPosition, setCurrentPosition ] = useState({ latitude: -23.5517764, longitude: -46.6335372 });
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    useEffect(()=>{
        async function handleCurrentPosition(){
            try {
                const { latitude, longitude } = await getCurrentLocation();
                if( latitude !== 0) {
                    setCurrentPosition({ latitude, longitude });
                }
            } catch (error) {
                console.log(error);
            }
        }

        handleCurrentPosition();
    }, []);

    useFocusEffect(()=>{
        try {
            api.get('orphanages').then(response =>{
                setOrphanages(response.data);
                setLoading(false);
            });
        } catch (error) {
            setLoading(false);
        }
    });

    function handleNavigateToOrphanageDetails(id: number){
        navigation.navigate('OrphanageDetails', { id });
    }

    function handleNavigateToCreateOrphanage(){
        navigation.navigate('SelectMapPosition');
    }

    if(loading) {
        return <Loading />;
    }

    return(
        <View style={styles.container}>
            <MapView 
            style={styles.map} 
            provider={PROVIDER_GOOGLE}
            initialRegion={{
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008
            }}>
                {
                    orphanages.map(orphanage=>{
                        return(
                            <Marker 
                            key={orphanage.id}
                            calloutAnchor={{
                                x: 2.7,
                                y: 0.8
                            }}
                            icon={mapMarker}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}
                            >
                                <Callout tooltip onPress={()=> handleNavigateToOrphanageDetails(orphanage.id)}>
                                    <View style={styles.calloutContainer}>
                                        <Text style={styles.calloutText}>{orphanage.name}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    })
                }
            </MapView>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    {orphanages.length} orfanatos encontrados
                </Text>
                <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
                    <Feather name="plus" size={20} color="#fff" />
                </RectButton>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    calloutContainer: {
        width: 160,
        height: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 16,
        justifyContent: 'center'
    },
    calloutText: {
        color: '#0089a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold'
    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: '#FFF',
        borderRadius: 20,
        height: 56,
        paddingLeft: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 10 
    },
    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold'
    },
    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});