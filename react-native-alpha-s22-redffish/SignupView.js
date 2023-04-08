import React from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";

class SignupView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    }

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleNevermind = this.handleNevermind.bind(this);
  }

  handleCreateAccount() {
    fetch("https://cs571.cs.wisc.edu/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.message === "User created!") {
          alert(JSON.stringify(res.message));
          this.props.navigation.navigate("Login");
        } else {
          // Username already taken!
          alert(JSON.stringify(res.message));
        }
      });
  }

  // When pressed, go back to login view
  handleNevermind() {
    this.props.navigation.navigate("Login");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>FitnessTracker</Text>
        <Text style={styles.title}>New here? Let's get started!{"\n"}Please create an account below.</Text>
        <TextInput style={styles.input} 
        placeholder="Username"
          onChangeText={(username) => this.setState({ username: username})}
        />
        <TextInput style={styles.input} 
          placeholder="Password"
          onChangeText={(password) => this.setState({ password: password})}
        />

        <View style={styles.button}>
          <Button title="CREATE ACCOUNT" onPress={this.handleCreateAccount} />
          <Button title="NEVERMIND!" onPress={this.handleNevermind} />
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

export default SignupView;
