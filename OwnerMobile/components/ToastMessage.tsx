import Toast from 'react-native-toast-message';

export const ToastMessage = (type: "success" | "error" | "info", title:string, body:string|undefined) => {
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
      visibilityTime: 5000,
    });
}

export default ToastMessage;