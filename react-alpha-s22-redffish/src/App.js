import React from "react";
import "./App.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Sidebar from "./Sidebar";
import CourseArea from "./CourseArea";

/**
 * The main application component.
 *
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: [], // All the courses fetched from the server.
      filteredCourses: [], // The courses to be displayed in the CourseArea under Search tab.
      subjects: [], // The list of unique subjects fetched from the server.
      completedCourses: [], // The list of *course numbers* of completed courses.

      cart: [],
      //unrated: 0,
    };
    this.setCart = this.setCart.bind(this);
  }

  /**
   * When the component mounts, fetch the classes data from the server.
   * Save the data in the state.
   *
   */
  componentDidMount() {
    // Fetch all the courses from the server
    fetch("https://cs571.cs.wisc.edu/api/react/classes")
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          allCourses: data,
          filteredCourses: data,
          subjects: this.getSubjects(data),
        });
      })
      .catch((err) => console.log(err));

    // Fetch the completed courses from the server.
    fetch("https://cs571.cs.wisc.edu/api/react/students/5022025924/classes/completed")
      .then((res) => res.json())
      .then((data) => {
        // Notice that completed courses are returned
        // as a list of course numbers, not course objects.
        this.setState({
          completedCourses: data.data,
        });
      })
      .catch((err) => console.log(err));
  }

  getSubjects(data) {
    // Get all the subjects from the JSON of fetched courses.
    // Return a list of unique subjects.

    let subjects = [];
    subjects.push("All");

    for (const course of Object.values(data)) {
      if (subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    // This is a callback function for the filteredCourses state.
    // Set the courses to be displayed in the CourseArea under Search tab.
    // Refer to the Sidebar component (Sidebar.js) to understand when this is used.

    this.setState({ filteredCourses: courses });
  }

  setCart(coursesInCart) {
    this.setState({ cart: coursesInCart });
  }

  render() {
    return (
      <>
        <Tabs
          defaultActiveKey="search"
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            backgroundColor: "white",
          }}
        >
          {/* Search Tab */}
          <Tab eventKey="search" title="Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
            />
            <div style={{ marginLeft: "20vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                compactMode={false} // Optionally, you could use this prop in the future for Cart and Completed Courses?
                setCart={(cart) => this.setCart(cart)}
                cart={this.state.cart}
                cartMode={false}
                ratingMode={false}
              />
            </div>
          </Tab>

          {/* Cart Tab */}
          <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "5vw" }}>
              {/* Put your component for the cart feature here. */}
              {/* Or, can you think of a way to reuse the CourseArea component?  */}
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                setCart={(cart) => this.setCart(cart)}
                cart={this.state.cart}
                cartMode={true}
                ratingMode={false}
              />
            </div>
          </Tab>

          {/* Completed Courses Tab */}
          <Tab eventKey="completedCourses" title="Completed Courses" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "5vw" }}>
              {/* Put your component for the completed courses feature here. */}
              {/* Or, can you think of a way to reuse the CourseArea component? */}
              <CourseArea 
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                completedCourses={this.state.completedCourses}
                cartMode={false}
                ratingMode={true}
              />
            </div>
          </Tab>

        </Tabs>
      </>
    );
  }

  // ratingCallBack2 = (dataFromRating) => {
  //   this.setState({unrated: dataFromRating});
  // }


}

export default App;
