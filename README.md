# AI Assistance Frontend

This project is a React application that serves as the frontend for the AI Assistance system. It utilizes Tailwind CSS for styling and provides a user-friendly interface for interacting with the AI backend.

## Project Structure

```
ai-assistance-frontend
├── public
│   └── index.html          # Main HTML file for the React application
├── src
│   ├── App.jsx             # Main App component
│   ├── index.js            # Entry point for the React application
│   ├── assets               # Directory for static assets (images, fonts, etc.)
│   ├── components           # Directory for reusable React components
│   ├── pages                # Directory for page components representing different views
│   └── styles
│       └── tailwind.css     # Tailwind CSS styles
├── tailwind.config.js       # Configuration file for Tailwind CSS
├── postcss.config.js        # Configuration file for PostCSS
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Getting Started

To get started with the project, follow these steps:

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd ai-assistance-frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

   This will start the development server and open the application in your default web browser.

## Tailwind CSS Setup

This project uses Tailwind CSS for styling. The styles are defined in the `src/styles/tailwind.css` file. You can customize the Tailwind configuration in the `tailwind.config.js` file.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

# AI Assistance Backend

## Overview
The AI Assistance Backend is a Node.js application that leverages the Google Generative AI API to provide code review functionalities. It allows developers to submit code snippets and receive constructive feedback, suggestions for improvements, and best practices.

## Project Structure
```
ai-assistance-backend
├── src
│   ├── controllers
│   │   └── ai.controller.js
│   ├── routes
│   │   └── ai.routes.js
│   ├── services
│   │   └── ai.service.js
│   └── app.js
├── .env
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-assistance-backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your environment variables:
   - Create a `.env` file in the root directory and add your Google Gemini API key:
     ```
     GOOGLE_GEMINI_KEY=your_api_key_here
     ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Send a POST request to the `/get-review` endpoint with the following JSON body:
   ```json
   {
     "code": "your_code_here"
   }
   ```

3. The server will respond with a review of the provided code, including suggestions for improvements and best practices.

## API Endpoints

### POST /get-review
- **Description**: Submits code for review.
- **Request Body**:
  - `code`: The code snippet to be reviewed (required).
- **Response**: A JSON object containing the review feedback.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

This project is licensed under the MIT License. See the LICENSE file for more details.
