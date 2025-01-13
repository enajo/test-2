import asyncio
from fastapi.testclient import TestClient
from websockets import connect
from main import app

client = TestClient(app)

def test_root():
    """
    Test the root endpoint to verify the backend is running.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend is running!"}

def test_toggle_mock_data():
    """
    Test the toggle endpoint for switching between mock and live data.
    """
    response = client.get("/toggle?mock=true")
    assert response.status_code == 200
    assert response.json()["message"] == "Data source switched to Mock Data"

    response = client.get("/toggle?mock=false")
    assert response.status_code == 200
    assert response.json()["message"] == "Data source switched to Live Sensor Data"

def test_session_summary():
    """
    Test the session summary endpoint.
    """
    response = client.get("/summary")
    assert response.status_code == 200
    summary = response.json()
    assert "correct_movements" in summary
    assert "incorrect_movements" in summary
    assert "average_muscle_activation" in summary
    assert "recommendations" in summary

async def test_websocket_stream():
    """
    Test the WebSocket endpoint for streaming data.
    """
    uri = "ws://localhost:8000/ws"
    async with connect(uri) as websocket:
        data = await websocket.recv()
        parsed_data = json.loads(data)
        assert "acc" in parsed_data
        assert "emg" in parsed_data
