from random import randint
from typing import Dict

# Mock Data Generator
def get_mock_data() -> Dict[str, list]:
    """
    Generates mock data for testing purposes.
    Returns:
        dict: Simulated accelerometer and EMG data.
    """
    return {
        "acc": [randint(-10, 10), randint(-10, 10), randint(-10, 10)],  # Simulated accelerometer data
        "emg": [randint(0, 100)]  # Simulated EMG data
    }

# Live Sensor Data Handler
def get_live_sensor_data() -> Dict[str, list]:
    """
    Fetches live sensor data using BITalino.
    Returns:
        dict: Processed accelerometer and EMG data.
    """
    from bitalino import BITalino  # Ensure BITalino library is installed

    # Replace with your BITalino's MAC address
    mac_address = "XX:XX:XX:XX:XX:XX"

    # Connect to the BITalino device
    device = BITalino(mac_address)

    try:
        # Start acquisition (adjust sampling rate and channels as needed)
        device.start(samplingRate=100, analogChannels=[0, 1])  # Example: Channel 0 = ACC, Channel 1 = EMG
        data = device.read(10)  # Read 10 frames of data
        return {
            "acc": data[:, 0].tolist(),  # Replace with actual column for accelerometer
            "emg": data[:, 1].tolist()   # Replace with actual column for EMG
        }
    except Exception as e:
        print(f"Error fetching live sensor data: {e}")
        return {"acc": [], "emg": []}
    finally:
        # Stop acquisition and close connection
        device.stop()
        device.close()
