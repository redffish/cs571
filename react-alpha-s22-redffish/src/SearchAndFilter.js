/**
 * A class used by Sidebar component to handle the search and filter functionality.
 *
 * Implement your own search and filter functionality here.
 *
 */

class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits) {
    let filteredCourses = [];
    courses.forEach(course => {
      let credit = parseInt(course.credits);
      search = search.trim().toLowerCase();
      if ((minimumCredits == '' || credit >= minimumCredits) && 
          (maximumCredits == '' || credit <= maximumCredits) && 
          (subject == 'All' || course.subject == subject) && 
          (search == '' || course.name.toLowerCase().includes(search) || course.description.toLowerCase().includes(search))) {
            filteredCourses.push(course);
      }
    });
    return filteredCourses;
  }
}

export default SearchAndFilter;
