import {useState, useEffect, useRef} from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Manifests from 'expo-manifests';


import { Platform } from 'react-native';

export interface PushNotificationState {
    notification?: Notifications.Notification;
    expoPushToken?: Notifications.ExpoPushToken;
}

export const usePushNotifcations = (): PushNotificationState => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false,
        })
    });

    

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();

    async function registerForPushNotificationAsync() {
        let token;
        if (Device.isDevice){
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Please give permission to receive notifications in your device app settings');
                return;
            }
            token = await Notifications.getExpoPushTokenAsync({
                projectId: "4da6ce48-192d-4621-a13b-404c73efd127"
            })

            console.log("Token:", token); // Check if it's undefined

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notifications.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#FF231F7C',
                });
              }

            return token;            
        } else {
            console.log("Must use physical device for Push Notifications")
        }
    }

    useEffect(() => {

        registerForPushNotificationAsync().then((token) => {
            setExpoPushToken(token);
        }).catch((error) => {
            console.log(error);
        });


        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!);
            Notifications.removeNotificationSubscription(notificationListener.current!);
        }

    }, [])

    return {
        notification,
        expoPushToken
    }

}