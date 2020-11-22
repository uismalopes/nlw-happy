interface Response {
    latitude: number;
    longitude: number;
}

export default async function getCurrentLocation(): Promise<Response> {
    return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(
            position => {
                const { coords } = position;
                const { latitude, longitude } = coords;
                resolve({ latitude, longitude });
            },
            error => reject(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    });
}