# Animastery AI Assistant

A full-stack application that helps users learn about animation styles through conversational AI.

## Project Structure

```
animastery-ai/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend service
├── docs/             # Project documentation
└── scripts/          # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.10 or higher)
- OpenAI API key

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python main.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Access the application at http://localhost:3000

## Features

- Interactive chat interface for animation style queries
- Knowledge base of animation styles and techniques
- Real-time AI-powered responses
- User-friendly interface with Chakra UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 