import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack"

import { SingIn } from "@screens/SignIn"
import { SignUp } from "@screens/SignUp"

type AuthRoutesTypeProps = {
  signIn: undefined,
  signUp: undefined,
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutesTypeProps>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesTypeProps>()

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen
        name="signIn"
        component={SingIn}
      />

      <Screen
        name="signUp"
        component={SignUp}
      />
    </Navigator>
  )
}