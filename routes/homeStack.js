import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
// import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
// import screenName from 'path'
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Map from '../screens/Map';
const screens = {
    // name of screen: {
    //   screen: screenName }
    Login: {
        screen: Login,
    },
    SignUp: {
        screen: SignUp,
    },
    Map: {
        screen: Map,
    },
};

const homeStack = createStackNavigator(screens);

export default createAppContainer(homeStack);

//import Navigator from 'routes/homeStack'
//^^^ use this in file u wana use navigation

//pass {navigation} where we usually pass props
//Props.navigation.navigate
//navigation.navigate('Name of screenName', {props})
