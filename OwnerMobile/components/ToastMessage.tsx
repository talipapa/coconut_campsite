import Toast from 'react-native-toast-message';

export const ToastMessage = (type: "success" | "error" | "info", title:string, body:string|undefined, time?: 5000) => {
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
      topOffset: 20,
      visibilityTime: time,
    });
}

export default ToastMessage;