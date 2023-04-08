import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

// const Rating = () => {

//   const [rating, setRating] = useState(null);


//   return (
//     <div>
      
//       <p><b>Rating: {rating}</b></p>
//       {[...Array(5)].map((star, i) => {
//         const ratingValue = i + 1;

//         return (
//           <label>
//             <input 
//               type="radio" 
//               name="rating" 
//               value = {ratingValue} 
//               onClick={()=> setRating(ratingValue)}
//             />
            
//             <FaStar className={star} size={20} color={ratingValue <= rating ? "#ffc300" : "#d5d8dC "}/>
//           </label>
//         );
//       })}
//     </div>
//   );
// };

class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: null,
    };
  }

  setRating() {
    return this.state.rating ? this.state.rating: "Not yet rated";
  }

  render() {
    return (
      <div>
        <p><b>Rating: {this.setRating()}</b></p>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;
          return (
            <label>
              <input 
                type="radio" 
                name="rating" 
                value = {ratingValue} 
                onClick={()=> this.setState({rating: ratingValue})}
              />
              <FaStar className={star} size={20} color={ratingValue <= this.state.rating ? "#ffc300" : "#d5d8dC "}/>
            </label>
          );
        })}
      </div>
    );
  }
}

export default Rating;