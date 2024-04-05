import { Alert, FlatList, Image, Pressable, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Picker } from '@react-native-picker/picker'
import { URL } from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaoHoaDon = ({ navigation }) => {

    const [listKhachHang, setlistKhachHang] = useState([]);
    const [KhachHang, setKhachHang] = useState([]);
    const [ListDichVu, setListDichVu] = useState([]);
    const [idKhachHang, setidKhachHang] = useState('');
    const [SoDienThoai, setSoDienThoai] = useState();
    const [DiaChi, setDiaChi] = useState();
    const [quantities, setQuantities] = useState({});
    const [TongTien, setTongTien] = useState(0);

    const [listHDCT, setlistHDCT] = useState([]);


    const getData = async () => {
        const id = await AsyncStorage.getItem('id_Bill');
        const url = `${URL}/hoadonchitiets?id_HoaDon=${id}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setlistHDCT(data);

        } catch (error) {
            console.log(error);
        }
    }

    const getKH = async () => {
        const url = `${URL}/khachhangs`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setlistKhachHang(data);

            if (idKhachHang != "") {
                getInfo();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getDV = async () => {
        const url = `${URL}/dichvus`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setListDichVu(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getInfo = async () => {
        const url = `${URL}/khachhangs/byid?_id=${idKhachHang}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            const khachhang = data.data;
            setKhachHang(khachhang);
            setDiaChi(khachhang.diaChi);
            setSoDienThoai(khachhang.dienThoai);
        } catch (error) {
            console.log(error);
        }
    }

    const deleteHDCT = async (id_DichVu) => {
        const url = `${URL}/hoadonchitiets/delete/${id_DichVu}`;
        const res = await fetch(url, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.status == 200) {
            getData()
            console.log(data.msg);
        } else {
            console.log(data.msg);
        }
    }

    const deleteHD = async () => {
        const id = await AsyncStorage.getItem('id_Bill');
        console.log(id);
        if (id == null) {
            navigation.goBack();
        } else {
            const url = `${URL}/hoadons/delete/${id}`
            const res = await fetch(url, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.status == 200) {
                navigation.goBack();
                await AsyncStorage.setItem('id_Bill', '');
            }
            console.log('====================================');
            console.log(data.msg);
            console.log('====================================');
        }
    }


    useEffect(() => {
        getDV();
        getKH();
        getData();
    }, [idKhachHang, navigation, quantities])

    // hàm format price
    const formatPrice = (price) => {
        // Chuyển đổi số tiền sang chuỗi và thêm dấu phẩy phân tách hàng nghìn
        const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return formattedPrice + " đ"; // Thêm ký hiệu VNĐ
    };



    useEffect(() => {
        // Tính tổng tiền của tất cả các mục
        const totalBill = Object.keys(quantities).reduce((total, key) => {
            const dichVu = ListDichVu.find(dv => dv._id == key);
            const giaTien = dichVu ? dichVu.giaTien : 0;
            return total + quantities[key] * giaTien;
        }, 0);

        // Cập nhật tổng tiền
        setTongTien(totalBill);
    }, [quantities]);

    const renderItem = ({ item, index }) => {
        const dichvu = ListDichVu.find(dv => dv._id == item.id_DichVu);
        const Quantity = quantities[item.id_DichVu] || 1; // Số lượng của mục đang được hiển thị

        const decreaseQuantity = () => {
            if (Quantity > 1) {
                setQuantities({
                    ...quantities,
                    [item.id_DichVu]: Quantity - 1
                });
            } else {
                deleteHDCT(item.id_DichVu)
            }
        };

        const increaseQuantity = () => {
            setQuantities({
                ...quantities,
                [item.id_DichVu]: Quantity + 1
            });
        };

        const totalPrice = item.giaTien * Quantity;

        return (
            <View style={{ marginTop: 15, borderWidth: 1, padding: 14, borderRadius: 10, flexDirection: 'row', gap: 20 }}>
                <Image source={{ uri: dichvu?.hinhAnh }} style={{ width: 100, height: 100 }} />
                <View>
                    <Text>{dichvu?.tenDichVu}</Text>
                    <Text>Giá : {formatPrice(item.giaTien)}</Text>

                    <Text>Tổng tiền : {formatPrice(totalPrice)}</Text>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                        <TouchableOpacity style={styles.btn} onPress={decreaseQuantity}>
                            <Image source={require('../assets/image/tru.png')} style={{ width: 14, height: 14 }} />
                        </TouchableOpacity>
                        <Text>{Quantity}</Text>
                        <TouchableOpacity style={styles.btn} onPress={increaseQuantity}>
                            <Image source={require('../assets/image/add.png')} style={{ width: 14, height: 14 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { listHDCT.length == 0 ? deleteHD() : navigation.goBack() }}>
                    <Image source={require('../assets/image/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.title}>TẠO HÓA ĐƠN</Text>
                <View />
            </View>

            <View style={[styles.input, { padding: 0 }]}>
                <Text> Khách hàng </Text>

                <Picker
                    selectedValue={idKhachHang}
                    onValueChange={(itemValue, itemIndex) => {
                        if (itemValue == '') {
                            setSoDienThoai("");
                            setDiaChi("");
                            setidKhachHang("")
                        } else {
                            setidKhachHang(itemValue)
                        }
                    }}>
                    <Picker.Item label='Chọn khách hàng' value='' />
                    {listKhachHang.map((kh) => (
                        <Picker.Item key={kh._id} label={kh.tenKhachHang} value={kh._id} />
                    ))}
                </Picker>

                <Text> Số điện thoại : {SoDienThoai}</Text>
                <Text> Địa chỉ : {DiaChi}</Text>
            </View>

            <View>
                <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>Dịch vụ yêu cầu</Text>
            </View>
            {listHDCT.length == 0 ?
                <TouchableOpacity onPress={() => navigation.navigate("Home")}><Text>Chưa có dịch vụ thêm ngay</Text></TouchableOpacity>
                : <View style={{ height: '70%' }}>
                    <FlatList
                        data={listHDCT}
                        keyExtractor={item => item._id}
                        renderItem={renderItem}></FlatList>
                    <View style={{ padding: 20, backgroundColor: 'pink', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Tổng tiền : {formatPrice(TongTien)}</Text>
                        <Pressable onPress={() => {
                            if (idKhachHang == '') {
                                ToastAndroid.show('Vui lòng chọn khách hàng', 0);
                            } else {
                                navigation.navigate('CheckBill', {
                                    tongTien: TongTien,
                                    khachHang: KhachHang,
                                    soDichVu: listHDCT.length
                                })
                            }
                        }}
                            style={{ padding: 10, backgroundColor: 'blue' }}>
                            <Text>Xác nhận</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </View>
    )
}

export default TaoHoaDon

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 16
    },
    header: {
        width: "100%",
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        width: 24,
        height: 24
    },
    btn: { width: 20, height: 20, backgroundColor: 'gray', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }
})