import React from "react";
import "./App.css";
// import Section from "./Section";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from "./Rating";

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      buttonText: "Add Course",
      buttonPressed: false,
      //unratedCourses: 0,
    };
    this.buttonOnClickAddRemoveCourse = this.buttonOnClickAddRemoveCourse.bind(this);
    this.buttonOnClickRemoveCourse = this.buttonOnClickRemoveCourse.bind(this);
  }

  getRequisites() {
    // reqs = [[A,B],[C,D,E],[F]]
    let reqs = this.props.data.requisites;
    let result = [];
    for (let i = 0; i < reqs.length; i++) {
      for (let j = 0; j < reqs[i].length; j++) {
        result.push(reqs[i][j]);
        if (j != reqs[i].length - 1) {
          result.push("or");
        }
      }
      if (i != reqs.length - 1) {
        result.push("AND");
      }
    }
    if (result.length === 0) {
      return "None";
    }
    return result.join(" ");
  }

  isInCart(course, cart) {
    cart.forEach(c => {
      if (c.number == course.number || c == course) {
        return true;
      }
    });
    if (cart.includes(course)) {
      return true;
    }
    return false;
  }

  addCourse(course, cart) {
    if (!this.isInCart(course, cart) && !cart.includes(course)) {
      cart.push(course);
    }
    return cart;
  }

  removeCourse(course, cart) {
    let index = cart.indexOf(course);
    cart.splice(index, 1);
    cart = cart.filter(item => item.number != course.number);
    cart = cart.filter(item => item != course);
    return cart;
  }

  buttonOnClickAddRemoveCourse() {
    this.state.buttonPressed ? this.props.setCart(this.removeCourse(this.props.data, this.props.cart))
                             : this.props.setCart(this.addCourse(this.props.data, this.props.cart));
    this.state.buttonPressed ? this.setState({buttonText: "Add Course"}) : this.setState({buttonText: "Remove Course"});
    this.state.buttonPressed ? this.setState({buttonPressed: false}) : this.setState({buttonPressed: true});
  }

  buttonOnClickRemoveCourse() {
    this.setState({buttonText:"Add Course"});
    this.props.setCart(this.removeCourse(this.props.data, this.props.cart));
  }

  render() {
    if (this.props.cartMode == true) {
      return (
        <Card>
          <Card.Body>
            <Card.Title>
              {this.props.data.number} – {this.props.data.name} &nbsp;&nbsp;
              {<Button variant="secondary" size="sm" onClick={this.buttonOnClickRemoveCourse}>Remove Course</Button>}
            </Card.Title>
            <Card.Subtitle className="m-3">
              {this.props.data.credits} Credits. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Subject: {this.props.data.subject}
            </Card.Subtitle>
            <Card.Text className="ms-3">
              <div className="mb-3">{this.props.data.description}</div>
            </Card.Text>
          </Card.Body>
        </Card>
      )
    } else if (this.props.ratingMode == true) {
      return (
        <Card>
          <Card.Body>
            <Card.Title>
              {this.props.data.number} – {this.props.data.name} &nbsp;&nbsp;
            </Card.Title>
            <Card.Subtitle className="m-3">
              {this.props.data.credits} Credits. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Subject: {this.props.data.subject}
            </Card.Subtitle>
            <Card.Text className="ms-3">
              <div className="mb-3">{this.props.data.description}</div>
              <div> <Rating/> </div>

              {/* <div> <Rating callBackFromRating={this.ratingCallBack1}/> </div> */}
            </Card.Text>
          </Card.Body>
        </Card>
      )

    } else {
      return (
        <Card>
          <Card.Body>
            <Card.Title>
              {this.props.data.number} – {this.props.data.name} &nbsp;&nbsp;
              {<Button variant="secondary" size="sm" onClick={this.buttonOnClickAddRemoveCourse}>{this.state.buttonText}</Button>}
            </Card.Title>
            <Card.Subtitle className="m-3">
              {this.props.data.credits} Credits. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Subject: {this.props.data.subject}
            </Card.Subtitle>
  
            <Card.Text className="ms-3">
              <div className="mb-3">{this.props.data.description}</div>
              <div><b>Requisites:</b> {this.getRequisites()}</div>
              <div className="mb-3"><u>Keywords:</u> {this.props.data.keywords.join(", ")}</div>
            </Card.Text>
  
            <Card.Text className="ms-3">
              <div className="h5">Sections:</div>
              {this.props.data.sections.map(section => (
                <div>
                  <ul>
                    <li className="h6">{section.number}</li>
                    <ul>
                      <li>Instructor: {section.instructor}</li>
                      <li>Location: {section.location}</li>
                      <li>Meeting Times:</li>
                      <ul>
                        {Object.keys(section.time).map((weekday, idx) => (
                          <li>{weekday}: {section.time[weekday]}</li>
                        ))}
                      </ul>
                      <li className="h6 mt-2">Subsections:</li>
                      {section.subsections.map(subsection => (
  
                        <ul className="mb-2">
                          <li className="h6">{subsection.number}</li>
                          <ul>
                            <li>{subsection.location}</li>
                            <li>Meeting Times:</li>
                            <ul>
                              {Object.keys(subsection.time).map((weekday, idx) => (
                                <li>{weekday}: {subsection.time[weekday]}</li>
                              ))}
                            </ul>
                          </ul>
                        </ul>
                      ))}
  
                    </ul>
                  </ul>
                </div>
              ))}
  
            </Card.Text>
  
          </Card.Body>
        </Card>
      )
    }
  }

  // ratingCallBack1 = (dataFromRating) => {
  //   this.setState({unratedCourses: dataFromRating});
  // }
}

export default Course;
