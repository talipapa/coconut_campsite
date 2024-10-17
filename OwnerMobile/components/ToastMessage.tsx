import Toast from 'react-native-toast-message';

export const showToast = (type: "success" | "error" | "info", title:string, body:string) => {
    Toast.show({
      type: type,
      text1: title,
      text2: body,
      autoHide: true,
      onPress: () => {
        Toast.hide();
      },
      swipeable: true,
      position: 'top',
      topOffset: 70,
      visibilityTime: 1500,
    });
}
