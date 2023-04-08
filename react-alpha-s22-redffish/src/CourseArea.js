import React from "react";
import "./App.css";
import Course from "./Course";

class CourseArea extends React.Component {
  getCourses() {
    // 1. Declarative way of returning the courses, using .map().
    // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map for more details.
    const courses = this.props.data.map((course) => {
      return <Course key={course.name} data={course} setCart={this.props.setCart} cart={this.props.cart} cartMode={false} ratingMode={false}/>;
    });

    // 2. Imperative way of returning the courses, using for ... of iteration and .push().
    // To use this instead, uncomment the following code and comment the above code.
    // let courses = [];

    // for(const course of this.props.data) {
    //   courses.push (
    //     <Course key={course.name} data={course}/>
    //   )
    // }

    return courses;
  }

  getCoursesFromCart() {
    let courses = [];

    this.props.cart.forEach(course => {
      courses.push(
        <Course key={course.name} data={course} setCart={this.props.setCart} cart={this.props.cart} cartMode={true} ratingMode={false}/>
      )
    });

    return courses;
  }

  getCompletedCourses() {
    let courses = []
    for (const completed of this.props.completedCourses) {
        for (const course of this.props.data) {
          if (completed == course.number) {
            courses.push(
              <Course key={course.name} data={course} completedCourses={this.props.completedCourses} cartMode={false} ratingMode={true} />
            )
          }
        }
      }
    return courses;
  }

  render() {
    if (this.props.cartMode == true) {
      return <div style={{ margin: "5px" }}>{this.getCoursesFromCart()}</div>;
    } else if (this.props.ratingMode == true) {
      return <div style={{ margin: "5px" }}>{this.getCompletedCourses()}</div>;
    } else {
      return <div style={{ margin: "5px" }}>{this.getCourses()}</div>;
    }
  }
}

export default CourseArea;
