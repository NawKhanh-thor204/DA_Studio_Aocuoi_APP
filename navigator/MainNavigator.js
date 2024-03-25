import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import DichVuScreen from '../screens/DichVuScreen';
import HoaDonScreen from '../screens/HoaDonScreen';
import ThongKeScreen from '../screens/ThongKeScreen';
import DichVuChiTiet from '../screens/DichVuChiTiet';
import Profile from '../screens/Profile';
import ManageUser from '../screens/ManageUser';
import KhachHangScreen from '../screens/KhachHangScreen';



const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: 'red',
            tabBarInactiveBackgroundColor: '#FFE6E6',
            tabBarActiveBackgroundColor: '#FFE6E6',
        }}>
            <Tab.Screen name='Home' component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../assets/image/home.png')} tintColor={color} />
                }} />

            <Tab.Screen name='Dịch vụ' component={DichVuScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../assets/image/dichvu.png')} tintColor={color} />
                }} />

            <Tab.Screen name='Hóa đơn' component={HoaDonScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../assets/image/hoadon.png')} tintColor={color} />
                }} />

            <Tab.Screen name='Thống kê' component={ThongKeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Image style = {{width: 20, height: 20}}
                    source={require('../assets/image/thongke.png')} tintColor={color} />
                }} />
        </Tab.Navigator>
    )
}


const MainNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='DichVuChiTiet' component={DichVuChiTiet} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='ManageUser' component={ManageUser} />
            <Stack.Screen name='KhachHangScreen' component={KhachHangScreen} />
        </Stack.Navigator>
    )
}

export default MainNavigator

const styles = StyleSheet.create({})