#### Project Overview 
This project uses next.js and supabase along with several python and cli utilities to operate smoothly. The secrutiy is fully supported on every table and requires affirmative response to allow access. (...) 


The project is a web application developed using Next.js, a React framework for building server-side rendered (SSR) and statically generated (SSG) applications. It includes various components and features aimed at providing a betting platform for users to place bets, manage groups, view betting history, and interact with social features.

The goal of this project is to create a platform that allows users to place bets and wagers with groups of friends.

##### Technology Stack:
The frontend of the application is developed using React, a popular JavaScript library for building user interfaces. Next.js, a framework built on top of React, is utilized for server-side rendering and routing in the application. Styling is achieved using CSS, with potential usage of CSS preprocessors like Sass or CSS-in-JS libraries like styled-components. The application incorporates various third-party libraries for additional features, such as React Router for client-side routing and Supabase for backend services like user authentication and data storage.

##### Application Architecture:
The application follows a component-based architecture, with each UI element encapsulated within reusable components. Components are organized into folders based on functionality, such as authentication, betting, groups, and user profiles. State management is handled using React's built-in state management or third-party libraries like Redux, depending on the complexity of the application's state. Routing between different views is managed using Next.js's routing system.

##### Frontend Components:
The frontend of the application consists of React components organized into a modular structure. Components such as the sidebar, header, footer, and various betting-related modules are implemented to provide a seamless user experience. Custom styling is applied using CSS to enhance the visual appeal and responsiveness of the UI.

##### Backend Integration:
The frontend interacts with a backend service, likely implemented using Supabase, a cloud-based platform for building applications with databases. Supabase is used for managing user authentication, storing betting data, managing groups, and other backend functionalities. APIs are utilized to communicate between the frontend and backend, enabling data retrieval and manipulation.

##### User Authentication:
The application features user authentication functionality to ensure secure access to user-specific data and features. Users can sign up, log in, and log out of their accounts using email/password authentication. Additionally, authentication tokens may be utilized for session management and secure API requests.

##### Mobile Responsiveness and Optimization:
Efforts are made to ensure the application is optimized for mobile devices, with responsive design techniques applied to adapt the layout and styling based on the device screen size. Media queries, flexbox, and grid layouts are employed to achieve consistent and visually appealing UI across different devices and screen resolutions. Performance optimization techniques may also be implemented to enhance the application's speed and efficiency.

##### Authentication Implementation:
Authentication is implemented using a context provider that manages user sessions. The context provider exposes methods for user authentication, session retrieval, and user state management. When a user logs in, their session data is stored in the context, allowing other components to access it and determine the user's authentication status.

#### Robots
I have yet to make a robots.txt file but it should be permissible to create "gold-mines." That is to abuse the non-limited odds and immediatley cash them out and recreate them. However, as this time there is absolutely no meaning to the amount of cash you have. Should there be stakes, there will likely be a migration to some zero-sum bet management.
#### Future Developments 
There are a few immeidate goals and long term goals for thgis proeject.
##### Short Term
- higher quality analytics for users bet history including line graphs of user balance
- highlighting unseen bets to users and filtering based on this
- filters for the user bets view
- public (global) bets 
- GODmode
- Notifications for new bets that users are akin to
##### Long Term
- transaction betting programming language (as in turing complete) 
    - named tadpole (like a baby frog)
    - This does raise a number of security issues and will likely need to be implemented by some interpreter into postgreSQL from... postgreSQL
#### Known Bugs
Currently it appears that the password reset and forgot your password features are unavaialbe. This will be fixed A$AP. 
