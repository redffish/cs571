import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import base64 from "base-64"; // Use this library to encode `username:password` to base64

class LoginView extends React.Component {
  // Use Basic access authentication (https://en.wikipedia.org/wiki/Basic_access_authentication) to authenticate the user.
  // React Native 1 lecture covered a good example of how to do this.

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    }
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
  }

  handleLogin() {
    fetch("https://cs571.cs.wisc.edu/login", {
      method: "GET",
      headers: {
        "Authorization": "Basic " + base64.encode(this.state.username + ":" + this.state.password)
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          this.props.setAccessToken(res.token);
          this.props.setUsername(this.state.username);
        } else {
          alert("Incorrect username or password! Please try again.");
        }
      });
  }

  handleSignup() {
    this.props.navigation.navigate("SignUp");
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>FitnessTracker</Text>
        <Text style={styles.title}>Welcome! Please login or signup to continue.</Text>
        <TextInput style={styles.input} 
          placeholder="Username" 
          onChangeText={(newUsername) => this.setState({ username: newUsername})}
        />
        <TextInput style={styles.input} 
          placeholder="Password" 
          onChangeText={(newPassword) => this.setState({ password: newPassword})}
        />

        {/* To navigate to another component, use this.props.navigation.navigate().
            See https://reactnavigation.org/docs/navigating for more details.
          */}

        <View style={styles.button}>
          <Button title="LOGIN" onPress={this.handleLogin} />
          <Button title="SIGNUP" onPress={this.handleSignup} />
        </View>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  title: {
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    height: 40,
    marginVertical: 10,
    width: "80%",
    alignSelf: "center",

  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "80%", 
    alignSelf:"center",
  },
});

export default LoginView;
