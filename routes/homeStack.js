import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Map from '../screens/Map';
import CaptureInt from '../screens/CaptureInt';
import Pokedex from '../screens/Pokedex';
import OtherPokedex from '../screens/OtherPokedex';
import JakeAvatar from '../screens/JakeAvatar';
import BattleScreen from '../screens/BattleScreen';
import BattlePokeDex from '../screens/BattlePokeDex';
import Winner from '../screens/Winner';
import Loser from '../screens/Loser';

const screens = {
    Login: {
        screen: Login,
        navigationOptions: {
            header: null,
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null,
        },
    },
    Map: {
        screen: Map,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
    CaptureInt: {
        screen: CaptureInt,
        navigationOptions: {
            header: null,
        },
    },
    Pokedex: {
        screen: Pokedex,
        // navigationOptions: {
        //     header: null,
        //     gestureEnabled: false,
        // },
    },
    OtherPokedex: {
        screen: OtherPokedex,
        // navigationOptions: {
        //     header: null,
        //     gestureEnabled: false,
        // },
    },
    BattlePokeDex: {
        screen: BattlePokeDex,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
    BattleScreen: {
        screen: BattleScreen,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
    JakeAvatar: {
        screen: JakeAvatar,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
    Loser: {
        screen: Loser,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
    Winner: {
        screen: Winner,
        navigationOptions: {
            header: null,
            gestureEnabled: false,
        },
    },
};

const homeStack = createStackNavigator(screens);

export default createAppContainer(homeStack);
