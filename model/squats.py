import cv2
import mediapipe as mp
import numpy as np
import json
import sys
import base64

# Initialize Mediapipe Pose
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

# Function to calculate angle between three points
def calculate_angle(a, b, c):
    a = np.array(a)  # First point
    b = np.array(b)  # Mid point
    c = np.array(c)  # End point

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

# Exercise counters and state
exercise_counters = {
    'squat': {'count': 0, 'state': 'up'},
    'pushup': {'count': 0, 'state': 'up'},
}

while True:  # Keep the script running to receive continuous data
    try:
        line = sys.stdin.readline().strip()  # Read a line from stdin
        if not line:  # Check for empty line (end of stream)
            break

        received_data = json.loads(line)  # Parse JSON received from Node.js
        frame_data = received_data.get('frame')  # Get the frame data

        if frame_data:
            decoded_frame = base64.b64decode(frame_data)  # Decode base64 frame data
            nparr = np.frombuffer(decoded_frame, np.uint8)  # Create numpy array from buffer
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Decode the image

            if frame is not None:  # Check if the frame was decoded correctly
                frame = cv2.flip(frame, 1)  # Flip the frame horizontally
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert color to RGB
                results = pose.process(image)  # Process the image with Mediapipe
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # Convert color back to BGR

                if results.pose_landmarks:  # Check if pose landmarks were detected
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)  # Draw landmarks

                    # Example: Squat detection (Tracking hip, knee, and ankle angles)
                    left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP].y]
                    right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y]
                    left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE].y]
                    right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].y]
                    left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].y]
                    right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].y]

                    left_angle = calculate_angle(left_hip, left_knee, left_ankle)  # Calculate left leg angle
                    right_angle = calculate_angle(right_hip, right_knee, right_ankle)  # Calculate right leg angle
                    avg_angle = (left_angle + right_angle) / 2  # Average angle for front-view squats

                    # Squat logic (same as before)
                    if avg_angle < 90 and exercise_counters['squat']['state'] == 'up':
                        exercise_counters['squat']['state'] = 'down'
                    if avg_angle > 160 and exercise_counters['squat']['state'] == 'down':
                        exercise_counters['squat']['state'] = 'up'
                        exercise_counters['squat']['count'] += 1

                    # Push-up detection (same as before)
                    left_shoulder, right_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER], landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
                    left_elbow, right_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW], landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
                    left_wrist, right_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST], landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]

                    left_pushup_angle = calculate_angle([left_shoulder.x, left_shoulder.y], [left_elbow.x, left_elbow.y], [left_wrist.x, left_wrist.y])
                    right_pushup_angle = calculate_angle([right_shoulder.x, right_shoulder.y], [right_elbow.x, right_elbow.y], [right_wrist.x, right_wrist.y])
                    pushup_avg = (left_pushup_angle + right_pushup_angle) / 2

                    if pushup_avg < 70 and exercise_counters['pushup']['state'] == 'up':
                        exercise_counters['pushup']['state'] = 'down'
                    if pushup_avg > 160 and exercise_counters['pushup']['state'] == 'down':
                        exercise_counters['pushup']['state'] = 'up'
                        exercise_counters['pushup']['count'] += 1

                    # Display counts on the image
                    cv2.putText(image, f"Squats: {exercise_counters['squat']['count']}", (50, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    cv2.putText(image, f"Push-ups: {exercise_counters['pushup']['count']}", (50, 100),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

                    # Encode the processed frame back to base64 for sending to the client
                    ret, encoded_image = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 80])  # Adjust JPEG quality (0-100)
                    frame_to_send = base64.b64encode(encoded_image).decode('utf-8')  # Encode to base64
                    result_to_send = {"squat_count": exercise_counters['squat']['count'], "pushup_count": exercise_counters['pushup']['count'], "frame": frame_to_send}  # Create JSON object

                    print(json.dumps(result_to_send))  # Send JSON to stdout
                    sys.stdout.flush()  # Flush stdout to send data immediately

                else:
                    print(json.dumps({"error": "No pose landmarks detected"}))  # Send error message if no landmarks
                    sys.stdout.flush()

            else:
                print(json.dumps({"error": "Could not decode frame"}))  # Send error if frame decoding fails
                sys.stdout.flush()

        else:
            print(json.dumps({"error": "No frame data received"}))  # Send error if no frame data
            sys.stdout.flush()

    except json.JSONDecodeError as e:  # Handle JSON decoding errors
        print(f"Error decoding JSON: {e}, Raw data: {line}")
    except EOFError:  # Handle end of file (when Node.js ends the stream)
        print("End of file reached. Exiting.")
        break
    except Exception as e:  # Handle other exceptions
        print(f"An error occurred: {e}")

    if cv2.waitKey(1) & 0xFF == ord('q'):  # Keep this for local testing (press 'q' to quit)
        break

cv2.destroyAllWindows()  # Close all OpenCV windows