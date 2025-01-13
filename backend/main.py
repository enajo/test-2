from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from data_sources import get_mock_data, get_live_sensor_data

# FastAPI app instance
app = FastAPI()

# Global toggle for data source
USE_MOCK_DATA = True  # Set to False for live sensor data

@app.get("/")
def root():
    """
    Root endpoint to verify the backend is running.
    """
    return {"message": "Backend is running!"}

@app.get("/toggle")
def toggle_data_source(mock: bool):
    """
    Toggle between mock data and live sensor data.
    """
    global USE_MOCK_DATA
    USE_MOCK_DATA = mock
    data_source = "Mock Data" if USE_MOCK_DATA else "Live Sensor Data"
    return {"message": f"Data source switched to {data_source}"}

@app.get("/summary")
def get_session_summary():
    """
    Example REST API endpoint for session summary.
    In production, this will fetch computed session data.
    """
    sample_summary = {
        "correct_movements": 15,
        "incorrect_movements": 3,
        "average_muscle_activation": 75.6,
        "recommendations": "Focus on consistent arm raises and higher activation."
    }
    return JSONResponse(content=sample_summary)

@app.websocket("/ws")
async def stream_data(websocket: WebSocket):
    """
    WebSocket endpoint to stream real-time data.
    Streams mock or live sensor data based on the global toggle.
    """
    await websocket.accept()
    try:
        while True:
            # Fetch data based on the global toggle
            data = get_mock_data() if USE_MOCK_DATA else get_live_sensor_data()
            await websocket.send_json(data)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
