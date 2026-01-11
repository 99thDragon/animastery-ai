from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import logging
from ai.rag_pipeline import process_query
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    query: str
    model: str = "gpt-3.5-turbo"

@app.get("/")
async def root():
    return {"message": "Animastery AI API is running"}

@app.post("/query")
async def query_endpoint(query: Query):
    try:
        logger.info(f"Received query: {query.query} with model: {query.model}")
        response = process_query(query.query, query.model)
        logger.info(f"Returning response: {response}")
        return response
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    logger.info("Starting Animastery AI API server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") 