import { View, Text } from 'react-native'
import React from "react";
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack screenOptions={{
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: "#56342A"
        },
        }}>
        <Stack.Screen name="(tabs)" options={{
            headerShown: false,
            

        }}/>
        <Stack.Screen
            name="booking/[id]"
            options={{
            presentation: 'modal',
            headerTitle: 'Details',
            headerTitleStyle:{
                color: 'white'
            },
            headerStyle: {
                backgroundColor: "#56342A"
            },
            headerSearchBarOptions:{
                placement: 'inline',
                
                headerIconColor: '#ffffff',
                textColor: '#ffffff',
                hintTextColor: '#ffffff',
    
                shouldShowHintSearchIcon: false,
                tintColor: '#ffffff',
            }

        }}/>
        <Stack.Screen
            name="bookings"
            options={{
            presentation: 'modal',
            headerTitle: 'Bookings',
            headerTitleStyle:{
                color: 'white'
            },
            headerStyle: {
                backgroundColor: "#56342A"
            },
            headerSearchBarOptions:{
                placement: 'inline',
                
                headerIconColor: '#ffffff',
                textColor: '#ffffff',
                hintTextColor: '#ffffff',
    
                shouldShowHintSearchIcon: false,
                tintColor: '#ffffff',
            }
        }}/>

        <Stack.Screen
            name="cashout/index"
            options={{
                presentation: 'modal',
                headerTitle: "Cash out",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
            }}
        />
        <Stack.Screen
            name="profile/index"
            options={{
                presentation: 'modal',
                headerTitle: "Profile",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
            }}
        />
        <Stack.Screen
            name="profile/change-password/index"
            options={{
                presentation: 'modal',
                headerTitle: "Change password",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/index"
            options={{
                presentation: 'modal',
                headerTitle: "Caretakers",
                headerTitleStyle:{
                    color: 'white'
                }
            }}
        />
        <Stack.Screen
            name="caretaker/[id]"
            options={{
                presentation: 'modal',
                headerTitle: "Account details",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/add"
            options={{
                presentation: 'modal',
                headerTitle: "Add caretaker",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
            }}
        />
        <Stack.Screen
            name="caretaker/change-password/index"
            options={{
                presentation: 'modal',
                headerTitle: "Change caretaker password",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                
            }}
        />

        <Stack.Screen
            name="(transaction)/allsuccessful"
            options={{
                presentation: 'modal',
                headerTitle: "Verified bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
                
            }}
        />

        <Stack.Screen
            name="(transaction)/currentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/previousmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Previous month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/cashonly"
            options={{
                presentation: 'modal',
                headerTitle: "Cash only bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/ewalletonly"
            options={{
                presentation: 'modal',
                headerTitle: "E-wallet only bookings",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/successfulcurrentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Successful bookings for the current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/cancelledcurrentmonth"
            options={{
                presentation: 'modal',
                headerTitle: "Cancelled bookings for the current month",
                headerTitleStyle:{
                    color: 'white'
                },
                headerStyle: {
                    backgroundColor: "#56342A"
                },
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }
            }}
        />
        <Stack.Screen
            name="(transaction)/scanned"
            options={{
                presentation: 'modal',
                headerTitle: "Campers scanned in",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#56342A",
                },     
                headerSearchBarOptions:{
                    placement: 'inline',
                    
                    headerIconColor: '#ffffff',
                    textColor: '#ffffff',
                    hintTextColor: '#ffffff',
        
                    shouldShowHintSearchIcon: false,
                    tintColor: '#ffffff',
                }     
            }}
        />
        <Stack.Screen
            name="(settings)/prices"
            options={{
                presentation: 'modal',
                headerTitle: "Prices",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#56342A",
                }    
            }}
        />
        <Stack.Screen
            name="(settings)/cabins"
            options={{
                presentation: 'modal',
                headerTitle: "Cabins",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#56342A",
                }     
            }}
        />
        <Stack.Screen
            name="singlecabin/[id]"
            options={{
                presentation: 'modal',
                headerTitle: "Cabin details",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#56342A",
                }     
            }}
        />
        <Stack.Screen
            name="singlecabin/extrapage/addcabin"
            options={{
                presentation: 'modal',
                headerTitle: "Add cabin",
                headerTitleStyle:{
                    color: 'white'
                },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: "#56342A",
                }     
            }}
        />
    </Stack>
  )
}

export default _layout