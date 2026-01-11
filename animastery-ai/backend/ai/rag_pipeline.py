import os
from typing import List, Dict, Any
import requests
from dotenv import load_dotenv
import json
import logging
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize OpenAI API key
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

logger.info(f"Initializing OpenAI client with base_url: {openai_base_url}")
# Initialize OpenAI client
client = OpenAI(
    api_key=openai_api_key,
    base_url=openai_base_url
)

def check_api_status():
    """Check OpenAI API status and quota."""
    try:
        logger.info("Making test request to OpenAI API...")
        # Make a minimal request to check API status
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=1
        )
        logger.info("OpenAI API is accessible")
        return True, None
    except Exception as e:
        error_msg = str(e).lower()
        logger.error(f"Error checking API status: {error_msg}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Full error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
        if any(keyword in error_msg for keyword in ["quota", "limit", "exceeded", "insufficient_quota"]):
            logger.error("API quota exceeded or insufficient tokens")
            return False, "quota_exceeded"
        elif "invalid_api_key" in error_msg:
            logger.error("Invalid API key")
            return False, "invalid_key"
        else:
            logger.error(f"API error: {e}")
            return False, "other_error"

# Check API status
logger.info("Checking API status...")
api_status, error_type = check_api_status()
if not api_status:
    if error_type == "quota_exceeded":
        raise ValueError("OpenAI API quota exceeded. Please check your account or try again later.")
    elif error_type == "invalid_key":
        raise ValueError("Invalid OpenAI API key. Please check your .env file.")
    else:
        raise ValueError("Error connecting to OpenAI API. Please try again later.")

# Predefined list of verified animation tutorials
VERIFIED_TUTORIALS = [
    {
        "title": "12 Principles of Animation",
        "video_id": "uDqjIdI4bF4",
        "channel": "Alan Becker"
    },
    {
        "title": "Animation for Beginners",
        "video_id": "qoHEjzLlzDM",
        "channel": "Jazza"
    },
    {
        "title": "Beginner's Guide to Animation",
        "video_id": "MF1qEhBSfq4",
        "channel": "Blender Guru"
    },
    {
        "title": "Animation Fundamentals",
        "video_id": "4OxphYV8W3E",
        "channel": "Aaron Blaise"
    }
]

def process_query(query: str, model: str = "gpt-3.5-turbo") -> Dict[str, Any]:
    """Process a user query and return a response."""
    try:
        logger.info(f"Processing query: {query} using model: {model}")
        
        # Check for test query - make this the first condition
        if "test video button" in query.lower():
            logger.info("Handling test video button query")
            test_response = {
                "text": "Here's a test response with video options. Click the buttons below to watch the tutorials!",
                "videos": [
                    {
                        "title": "Test Video 1 - Animation Basics",
                        "video_id": "uDqjIdI4bF4",
                        "channel": "Test Channel"
                    },
                    {
                        "title": "Test Video 2 - Advanced Techniques",
                        "video_id": "qoHEjzLlzDM",
                        "channel": "Test Channel"
                    }
                ]
            }
            logger.info(f"Returning test response: {test_response}")
            return test_response
        
        # Check for animation style queries
        if any(keyword in query.lower() for keyword in ["types of animation", "animation styles", "kinds of animation"]):
            logger.info("Handling animation styles query")
            return {
                "text": """Here are the main types of animation:

1. Traditional Animation (2D)
   - Hand-drawn frame-by-frame animation
   - Example: Classic Disney films like Snow White

2. 3D Animation
   - Computer-generated 3D models and environments
   - Example: Pixar films like Toy Story

3. Stop Motion
   - Physical objects moved incrementally and photographed
   - Example: Wallace & Gromit

4. Motion Graphics
   - Animated graphic design elements
   - Example: Animated logos and title sequences

5. Vector Animation
   - Scalable vector graphics animation
   - Example: Flash animations

6. Cutout Animation
   - Flat characters and props cut from materials
   - Example: South Park

7. Rotoscoping
   - Tracing over live-action footage
   - Example: A Scanner Darkly""",
                "videos": [
                    {
                        "title": "12 Principles of Animation",
                        "video_id": "uDqjIdI4bF4",
                        "channel": "Alan Becker"
                    },
                    {
                        "title": "Animation Styles Explained",
                        "video_id": "qoHEjzLlzDM",
                        "channel": "Blender Guru"
                    },
                    {
                        "title": "3D Animation Basics",
                        "video_id": "MF1qEhBSfq4",
                        "channel": "CG Geek"
                    }
                ]
            }
        
        # For other queries, use OpenAI
        logger.info("Using OpenAI for general query")
        try:
            # Check API status before making the request
            api_status, error_type = check_api_status()
            if not api_status:
                if error_type == "quota_exceeded":
                    logger.error("API quota exceeded")
                    return {"text": "I apologize, but it seems you've run out of tokens or exceeded your API quota. Please check your OpenAI account or try again later."}
                elif error_type == "invalid_key":
                    logger.error("Invalid API key")
                    return {"text": "There seems to be an issue with the API key. Please check your configuration."}
                else:
                    logger.error("API error")
                    return {"text": "I apologize, but I encountered an error with the AI service. Please try again."}

            messages = [
                {"role": "system", "content": "You are an expert in animation styles and techniques. Please provide detailed and informative answers about animation, including specific examples and characteristics where relevant."},
                {"role": "user", "content": query}
            ]
            
            logger.info(f"Making OpenAI API request with model: {model}...")
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7
            )
            
            logger.info("OpenAI API request successful")
            content = response.choices[0].message.content.strip()
            return {"text": content}
                
        except Exception as e:
            error_msg = str(e)
            logger.error(f"OpenAI API Error: {error_msg}")
            logger.error(f"Error type: {type(e)}")
            logger.error(f"Full error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
            
            if any(keyword in error_msg.lower() for keyword in ["quota", "limit", "exceeded", "insufficient_quota"]):
                return {"text": "I apologize, but it seems you've run out of tokens or exceeded your API quota. Please check your OpenAI account or try again later."}
            elif "invalid_api_key" in error_msg.lower():
                return {"text": "There seems to be an issue with the API key. Please check your configuration."}
            else:
                return {"text": f"I apologize, but I encountered an error with the AI service: {error_msg}. Please try again."}

    except Exception as e:
        logger.error(f"General Error: {str(e)}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Full error details: {e.__dict__ if hasattr(e, '__dict__') else 'No additional details'}")
        return {"text": "I apologize, but I encountered an error processing your request. Please try again."} 