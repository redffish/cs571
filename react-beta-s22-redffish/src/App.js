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
      completedCourses: [], // The list of completed courses.
      cartCourses: [], // The list of courses in the cart.
    };
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

        return data;
      })
      .then((allCourses) => {
        // fetch all the completed courses
        fetch(
          "https://cs571.cs.wisc.edu/api/react/students/5022025924/classes/completed/"
        )
          .then((res) => res.json())
          .then((completedCourseNumbers) => {
            this.setState({
              completedCourses: completedCourseNumbers.data.map(
                (courseNumber) =>
                  allCourses.find((course) => course.number === courseNumber)
              ),
            });
          });
      })
      .catch((err) => console.log(err));
  }

  // Callback function that adds a new course to the cartCourses state
  addCartCourse = (course) => {
    // Duplicate check
    if (
      this.state.cartCourses.some(
        (cartCourse) => cartCourse.number === course.number
      )
    ) {
      console.log(`${course.number} is already in the cart`);
    } else {
      this.setState({
        cartCourses: [...this.state.cartCourses, course],
      });
    }
  };

  // Callback function that removes a course from the cartCourses state
  removeCartCourse(course) {
    this.setState({
      cartCourses: this.state.cartCourses.filter(
        (cartCourse) => cartCourse.number !== course.number
      ),
    });
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

  // Callback function that sets the rating of a course
  setRating(courseNumber, rating) {
    this.setState({
      completedCourses: this.state.completedCourses.map((course) => {
        if (course.number === courseNumber) {
          course.rating = rating;
        }
        return course;
      }),
    });
  }

  // Returns the number of courses that are not rated yet.
  getNumCoursesNeedsRating() {
    const numRatedCourses = this.state.completedCourses.filter(
      (course) => course.rating !== undefined
    ).length;

    return this.state.completedCourses.length - numRatedCourses;
  }

  setCourses(courses) {
    // This is a callback function for the filteredCourses state.
    // Set the courses to be displayed in the CourseArea under Search tab.
    // Refer to the Sidebar component (Sidebar.js) to understand when this is used.
    this.setState({ filteredCourses: courses });
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
          <Tab eventKey="search" title="Course Search" style={{ paddingTop: "5vh" }}>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
            />
            <div className="row" style={{ marginLeft: "20vw" }} >
              <div className="column border">
              <div className="h5 p-3 text-white" style={{backgroundColor:"#0379A8"}}>Search for courses</div>
                <CourseArea 
                  data={this.state.filteredCourses}
                  allData={this.state.allCourses}
                  cartCourses={this.state.cartCourses}
                  addCartCourse={this.addCartCourse.bind(this)}
                  removeCartCourse={this.removeCartCourse.bind(this)}
                />
              </div>
              <div className="column border">
                <div className="h5 p-3 text-white" style={{backgroundColor:"#0379A8"}}>Cart courses</div>
                <CourseArea
                  data={this.state.filteredCourses}
                  allData={this.state.allCourses}
                  cartCourses={this.state.cartCourses}
                  addCartCourse={this.addCartCourse}
                  removeCartCourse={this.removeCartCourse.bind(this)}
                  mode="cart"
                />
              </div>
            </div>
          </Tab>

          {/* Cart Tab */}
          {/* <Tab eventKey="cart" title="Cart" style={{ paddingTop: "5vh" }}>
            <div style={{ marginLeft: "5vw" }}>
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                cartCourses={this.state.cartCourses}
                addCartCourse={this.addCartCourse}
                removeCartCourse={this.removeCartCourse.bind(this)}
                mode="cart"
              />
            </div>
          </Tab> */}

          {/* Completed Courses Tab */}
          <Tab
            eventKey="completedCourses"
            title={`Completed Courses (${this.getNumCoursesNeedsRating()} needs rating)`}
            style={{ paddingTop: "5vh" }}
          >
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
            />
            <div className="row" style={{ marginLeft: "20vw" }}>
              <div className="column border">
                <div className="h5 p-3 text-white" style={{backgroundColor:"#0379A8"}}> Completed Courses </div>
                <CourseArea
                  data={this.state.completedCourses}
                  allData={this.state.allCourses}
                  setRating={this.setRating.bind(this)}
                  mode="completed"
                />
              </div>
              <div className="column border">
                <div className="h5 p-3 text-white" style={{backgroundColor:"#0379A8"}}>Cart courses</div>
                <CourseArea
                  data={this.state.filteredCourses}
                  allData={this.state.allCourses}
                  cartCourses={this.state.cartCourses}
                  addCartCourse={this.addCartCourse}
                  removeCartCourse={this.removeCartCourse.bind(this)}
                  mode="cart"
                />
              </div>
            </div>
            
          </Tab>
        </Tabs>
      </>
    );
  }
}

export default App;
