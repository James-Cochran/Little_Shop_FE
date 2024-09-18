# Little Shop | Group Project

### Abstract:
(Briefly describe what you built and its features. What problem is the app solving? How does this application solve that problem?)
  This project implements a complete CRUD (Create, Read, Update, Delete) functionality for merchants using a front-end application that consumes data from a back-end API. The app allows users to manage merchants and their associated items through a user-friendly interface. Users can add new merchants, edit merchant details, view a merchant's items, and delete merchants. The front-end code is built using JavaScript, HTML, and CSS, ensuring a responsive and intuitive design. This project aims to provide a well-rounded, accessible, and efficient tool for merchant management, integrating solid front-end development practices with dynamic back-end API interactions.

### Installation Instructions:
(What steps does a person have to take to get your app cloned down and running?)
  1) Start by cloning down two seperate repositories the back end git clone git@github.com:bwillett2003/little_shop.git and the front end git clone git@github.com:James-Cochran/Little_Shop_FE.git
  2) Navigate to the back end directory and install your dependencies bundle install, and set up the database rails db:{drop,create,migrate,seed} , rails db:schema:dump.
      connect to the rails server.
  3)  While the back end is running navigate into the front end directory and run npm run dev.
  4) Now that both back end and front end servers are running open a browser and visit http://localhost:5173

### Preview of App:
(Provide ONE gif or screenshot of your application - choose the "coolest" piece of functionality to show off. gifs preferred!)
  ![Little Shop](https://github.com/James-Cochran/Little_Shop_FE/blob/main/LittleShop.gif)

### Context:
(Give some context for the project here. How long did you have to work on it? What specific work/improvements did you contribute to this FE application?)
  Over the course of a week, we developed a back-end API and successfully integrated it with a boilerplate front-end application. Our focus was on improving the user experience and interface design.
One of the first enhancements we made was improving the visual feedback for clickable elements. We updated the CSS to change the cursor to a pointer on button hover, making it immediately clear to users which elements are interactive.
Next, we refactored the Items page layout using flexbox, organizing item cards into a responsive, visually appealing grid. We aligned text centrally and applied consistent margins and spacing to create a cleaner, more readable design.
We also refined the buttons by rounding the corners and adding subtle hover effects like background color changes and shadows, giving the interface a more polished and dynamic feel. To tie everything together, we introduced a cohesive color scheme with a vibrant, transitioning background that adds texture and visual depth to the application. These changes significantly improved both the aesthetic and functionality of the user interface.

### Contributors:
(Who worked on this application? Link to your GitHub. Consider also providing LinkedIn link)
  [Bryan Willett](https://github.com/bwillett2003)(https://www.linkedin.com/in/bryan--willett/)
  [James Cochran](https://github.com/James-Cochran)(https://www.linkedin.com/in/james-cochran-/)
  [John Hill](https://github.com/jphill19)(https://www.linkedin.com/in/johnpierrehill/)
  [Shawn Thompson](https://github.com/SThompson05)(https://www.linkedin.com/in/shawn-thompson24/)

### Learning Goals:
(What were the learning goals of this project? What tech did you work with?)
  Our most consistent learning goals starting out in this project was to improve Github workflow and group work collaboration.  Also improving our understanding of a full stack    programming relationship, specifically in the API and JSON relationships.  We also wanted to solidify some JS and ActiveRecord comprehension.  We utalized a multitude of resources from class lessons and notes, to MDN and Ruby docs, and a decent amount of John's brain.

### Wins + Challenges:
(What are 2-3 wins you have from this project? What were some challenges you faced - and how did you get over them?)
  One challenge we encountered was implementing merchant sorting across the application. After adding the sortMerchant function, we noticed it wasn’t being applied consistently in all areas as expected. Upon further investigation, we realized the sorting logic needed to be integrated into the submitMerchant, deleteMerchant, and editMerchant functions as well. To address this, we mob programmed to ensure that the sorting functionality was properly applied throughout the entire codebase, making sure it worked as intended in all relevant areas.

  One of the design features we implemented was an interactive tab system for the merchant and item views. The unselected tab floats adjacent to the main display, while the selected tab smoothly transitions and merges into the main display. When switching between tabs, the previously selected tab disconnects and returns to its floating state. Implementing this effect required time and research to fine-tune the calculations and ensure smooth, consistent animations across both merchant and item boxes. We focused on optimizing the transitions for fluidity and responsiveness to enhance the overall user experience.