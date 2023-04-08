import React from "react";
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Button, TextInput } from "react-native";

class ProfileView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      goalDailyCalories: 0.0,
      goalDailyProtein: 0.0,
      goalDailyCarbohydrates: 0.0,
      goalDailyFat: 0.0,
      goalDailyActivity: 0.0,
    }

    this.handleSaveProfile = this.handleSaveProfile.bind(this);
  }

  componentDidMount() {
    fetch("https://cs571.cs.wisc.edu/users/" + this.props.username, {
      method: "GET",
      headers: {
        "x-access-token": this.props.accessToken,
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          firstName: res.firstName,
          lastName: res.lastName,
          goalDailyCalories: res.goalDailyCalories,
          goalDailyProtein: res.goalDailyProtein,
          goalDailyCarbohydrates: res.goalDailyCarbohydrates,
          goalDailyFat: res.goalDailyFat,
          goalDailyActivity: res.goalDailyActivity,
        });
      });
  }

  handleSaveProfile() {
   fetch('https://cs571.cs.wisc.edu/users/' + this.props.username, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': this.props.accessToken,
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goalDailyCalories: this.state.goalDailyCalories,
        goalDailyProtein: this.state.goalDailyProtein,
        goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
        goalDailyFat: this.state.goalDailyFat,
        goalDailyActivity: this.state.goalDailyActivity
      })
    })
      .then(res => res.json())
      .then(res => {
        alert("Your profile has been updated!");
      });
  }

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
          <Text style={styles.header}>About Me</Text>
          <Text style={styles.title}>Let's get to know you!{"\n"}Specify your information below.</Text>
          <Text style={styles.subheader}>Personal Information</Text>
          
          <Text style={styles.text}>First Name</Text>
          <TextInput style={styles.input} 
            placeholder="Bucky"
            onChangeText={(firstName) => this.setState({ firstName: firstName })}
            value={this.state.firstName}
          />

          <Text style={styles.text}>Last Name</Text>
          <TextInput style={styles.input} 
            placeholder="Badger"
            onChangeText={(lastName) => this.setState({ lastName: lastName })}
            value={this.state.lastName}
          />

          <Text style={styles.subheader}>Fitness Goals</Text>
          
          <Text style={styles.text}>Daily Calories (kcal)</Text>
          <TextInput style={styles.input} 
            placeholder="0"
            onChangeText={(goalDailyCalories) => this.setState({ goalDailyCalories: goalDailyCalories })}
            value={this.state.goalDailyCalories? this.state.goalDailyCalories.toString() : 0}
          />

          <Text style={styles.text}>Daily Protein (grams)</Text>
          <TextInput style={styles.input} 
            placeholder="0"
            onChangeText={(goalDailyProtein) => this.setState({ goalDailyProtein: goalDailyProtein })}
            value={this.state.goalDailyProtein? this.state.goalDailyProtein.toString() : 0}
          />

          <Text style={styles.text}>Daily Carbs (grams)</Text>
          <TextInput style={styles.input} 
            placeholder="0"
            onChangeText={(goalDailyCarbohydrates) => this.setState({ goalDailyCarbohydrates: goalDailyCarbohydrates })}
            value={this.state.goalDailyCarbohydrates? this.state.goalDailyCarbohydrates.toString() : 0}
          />

          <Text style={styles.text}>Daily Fat (grams)</Text>
          <TextInput style={styles.input} 
            placeholder="0"
            onChangeText={(goalDailyFat) => this.setState({ goalDailyFat: goalDailyFat })}
            value={this.state.goalDailyFat? this.state.goalDailyFat.toString() : 0}
          />

          <Text style={styles.text}>Daily Activity (mins)</Text>
          <TextInput style={styles.input} 
            placeholder="0"
            onChangeText={(goalDailyActivity) => this.setState({ goalDailyActivity: goalDailyActivity })}
            value={this.state.goalDailyActivity? this.state.goalDailyActivity.toString() : 0}
          />

          <Text style={styles.subheader}>Looks good! All Set?</Text>

          <Button
            title="Save Profile"
            onPress={this.handleSaveProfile}
          />
          <View style={styles.space} />
        </KeyboardAvoidingView>
      </ScrollView>
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
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
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
    marginTop: 30,
  },
  subheader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
    textAlign: "left",
    marginLeft: 35,
    marginVertical: 2,
  },
  space: {
    height: 30,
  }
});

export default ProfileView;
