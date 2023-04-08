import 'react-native-gesture-handler';
import React from "react";

import LoginView from "./LoginView";
import SignupView from "./SignupView";
import ProfileView from "./ProfileView";
import ExercisesView from "./ExercisesView";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';

import {Button} from "react-native";

// Review the navigators from React Native 2 lecture.
const Stack = createStackNavigator(); // Stack Navigator (https://reactnavigation.org/docs/stack-navigator)
const Tab = createBottomTabNavigator(); // Bottom Tabs Navigator (https://reactnavigation.org/docs/tab-based-navigation)
const Drawer = createDrawerNavigator(); // Drawer Navigator (https://reactnavigation.org/docs/drawer-navigator)

function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile">
        {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function ExercisesScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Exercises">
        {(props) => <ExercisesView {...props} username={this.state.username} accessToken={this.state.accessToken}/>}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

class App extends React.Component {
  constructor() {
    super();

    // Feel free to add more states here
    this.state = {
      accessToken: undefined,
      username: undefined,
    };

    this.setAccessToken = this.setAccessToken.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.removeAccessToken = this.removeAccessToken.bind(this);
    
  }

  // Set the access token
  setAccessToken = (accessToken) => {
    this.setState({ accessToken: accessToken });
  };

  // Set the user name
  setUsername = (username) => {
    this.setState({ username: username });
  }

  removeAccessToken = () => {
    this.setState({ accessToken: undefined });
  }

  render() {
    return (
      <NavigationContainer>
          { 
            !this.state.accessToken ? (
              <>
                <Stack.Navigator>
                <Stack.Screen name="Login">
                  {/* This is how you pass props (e.g. setAccessToken) to another component */}
                  {(props) => (
                    <LoginView {...props} setAccessToken={this.setAccessToken} setUsername={this.setUsername}/>
                  )}
                </Stack.Screen>
                <Stack.Screen name="SignUp" component={SignupView} />
                </Stack.Navigator>
              </>
              ) : (
              <>
                <Tab.Navigator 
                  screenOptions={{
                    tabBarIconStyle: { display: "none" },
                    tabBarLabelPosition: "beside-icon",
                    tabBarLabelStyle: {
                      fontWeight: "700",
                      fontSize: 15,
                    },
                  }}
                >
                  <Tab.Screen 
                    name="Profile"
                    options = {{
                      headerTitleAlign: "left",
                      headerRight: () => (
                        <Button
                          onPress={this.removeAccessToken}
                          title="Log out"
                        />
                      ),
                    }}
                  >
                    {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken}/>}
                  </Tab.Screen>

                  <Tab.Screen 
                    name="Exercises"
                    options = {{
                      headerTitleAlign: "left",
                      headerRight: () => (
                        <Button
                          onPress={this.removeAccessToken}
                          title="Log out"
                        />
                      ),
                    }}
                  >
                    {(props) => <ExercisesView {...props} username={this.state.username} accessToken={this.state.accessToken}/>}
                  </Tab.Screen>
                </Tab.Navigator>
              </>
            )
          }
      </NavigationContainer>
    );
  }
}

export default App;

{/* We only want to show Login and Signup View when the user is not logged in.
              When the user is logged in, we want to show the Profile View and the Exercises View.
              
              How do we do this? See https://reactnavigation.org/docs/auth-flow
            */}
{/* If you do not need to pass props, you can pass a component as a `component` prop to Screens like below */}
{/* We can also nest another navigator (e.g. Bottom Tabs, Drawer, etc.) inside a stack navigator.
              See https://reactnavigation.org/docs/nesting-navigators on how to nest navigators.
            */}

                {/* <Stack.Screen 
                  name="Profile"
                  options = {{
                    headerTitleAlign: "left",
                    headerRight: () => (
                      <Button
                        onPress={this.removeAccessToken}
                        title="Log out"
                      />
                    )
                  }}
                >
                  {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken}/>}
                </Stack.Screen> */}