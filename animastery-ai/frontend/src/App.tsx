import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { sendMessage } from './services/api';
import ThemeToggle from './components/ThemeToggle';

interface VideoInfo {
  title: string;
  video_id: string;
  channel: string;
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  videos?: VideoInfo[];
}

interface VideoState {
  isVisible: boolean;
  videoId: string | null;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash' },
  { id: 'xiaomi/mimo-v2-flash:free', name: 'Xiaomi MiMo' },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B' },
];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [videoState, setVideoState] = useState<VideoState>({
    isVisible: false,
    videoId: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputValue, selectedModel);
      setMessages((prev) => [...prev, {
        text: response.text,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
        videos: response.videos
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const checkVideoAvailability = async (videoId: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      return response.ok;
    } catch (error) {
      console.error('Error checking video availability:', error);
      return false;
    }
  };

  const openVideo = async (videoId: string) => {
    const isAvailable = await checkVideoAvailability(videoId);
    if (isAvailable) {
      setVideoState({
        isVisible: true,
        videoId
      });
    } else {
      setMessages(prev => [...prev, {
        text: "I apologize, but this video is currently unavailable. I'll try to find an alternative resource for you.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  const closeVideo = () => {
    setVideoState({
      isVisible: false,
      videoId: null
    });
  };

  const formatMessageContent = (text: string, videos?: VideoInfo[]) => {
    return (
      <>
        {text.split('\n').map((paragraph, pIndex) => (
          <p key={pIndex}>{paragraph}</p>
        ))}
        {videos && videos.length > 0 && (
          <div className="video-list">
            {videos.map((video, index) => (
              <button
                key={index}
                onClick={() => openVideo(video.video_id)}
                className="video-button"
              >
                {video.title} by {video.channel}
              </button>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`app-container ${videoState.isVisible ? 'with-video' : ''}`}>
      <div className="top-controls">
        <select
          className="model-selector"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {AVAILABLE_MODELS.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <div className="welcome-content">
        <h1 className="title">Animastery AI Assistant</h1>
        <p className="greeting">Hello, Animator!</p>
        <p className="description">
          Ask me anything about animation styles, techniques, or history.
        </p>
      </div>

      <div className="main-content">
        <div className={`chat-container ${videoState.isVisible ? 'with-video' : ''}`}>
          <div className="messages-container">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <div className="message-content">
                  {formatMessageContent(message.text, message.videos)}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <input
              type="text"
              className="message-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              className="send-button"
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {videoState.isVisible && videoState.videoId && (
        <div className="video-container visible">
          <button className="video-close" onClick={closeVideo}>×</button>
          <iframe
            src={`https://www.youtube.com/embed/${videoState.videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default App;
