import React from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Button, Modal, TextInput } from "react-native";

class ExercisesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      activity: {
        calories: 0.0,
        date: "",
        duration: 0.0,
        id: 0,
        name: "",
      },
      activities: []
    }

    this.handleSaveExercise = this.handleSaveExercise.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleCaloriesChange = this.handleCaloriesChange.bind(this);
  }

  componentDidMount() {
    fetch("https://cs571.cs.wisc.edu/activities", {
      method: "GET",
      headers: {
        "x-access-token": this.props.accessToken,
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ 
          activity: res.activities,
        })
      });
  }
  
  handleSaveExercise() {
    this.setState({
      isModalVisible: false
    }, () => fetch("https://cs571.cs.wisc.edu/activities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": this.props.accessToken,
      },
      body: JSON.stringify({
        calories: this.state.activity.calories,
        date: "",
        duration: this.state.activity.duration,
        id: Math.random(),
        name: this.state.activity.name,
      })
    })
      .then(res => res.json())
      .then(res => alert("Exercise updated!"))
    );
  }

  handleNameChange(name) {
    this.setState({
      activity: {
        ...this.state.activity,
        name: name,
      }
    });
  }

  handleDurationChange(duration) {
    this.setState({
      activity: {
        ...this.state.activity,
        duration: duration,
      }
    });
  }

  handleCaloriesChange(calories) {
    this.setState({
      activity: {
        ...this.state.activity,
        calories: calories,
      }
    });
  }

  
  render() {
    const items = this.state.activities.map((val) => {
      return (<li>{val.id}</li>)
  });
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
          <Text style={styles.header}>Exercises</Text>
          <Text style={styles.title}>Let's get to work!{"\n"}Record your exercises below.</Text>
          <Button title="ADD EXERCISE" onPress={() => {this.setState({ isModalVisible: true })}} />
          
          <Modal visible={this.state.isModalVisible}>
            <View style={styles.container}>
              <Text style={styles.subheader}>Exercise Details</Text>

              <Text style={styles.text}>Exercise Name</Text>
              <TextInput style={styles.input} 
                placeholder="Jogging"
                onChangeText={(name) => this.handleNameChange(name)}
                value={this.state.activity.name}
              />

              <Text style={styles.text}>Duration (minutes)</Text>
              <TextInput style={styles.input} 
                placeholder="0"
                onChangeText={(duration) => this.handleDurationChange(duration)}
                value={this.state.activity.duration? this.state.activity.duration : 0}
              />

              <Text style={styles.text}>Calories Burnt</Text>
              <TextInput style={styles.input} 
                placeholder="0"
                onChangeText={(calories) => this.handleCaloriesChange(calories)}
                value={this.state.activity.calories? this.state.activity.calories : 0}
              />

              <Text style={styles.title}>Looks good! Ready to save your work?</Text>

              <View style={styles.button}>
                <Button title="SAVE EXERCISE" onPress={this.handleSaveExercise} />
                <Button title="NEVERMIND!" onPress={() => { this.setState({ isModalVisible: false }) }} />
              </View>

            </View>
          </Modal>
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
  },
  button: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    width: "80%", 
    alignSelf:"center",
  },
});


export default ExercisesView;
