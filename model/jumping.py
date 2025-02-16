import cv2
import mediapipe as mp
import numpy as np
import json
import sys
import base64

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose()

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

exercise_counters = {
    'jumping_jack': {'count': 0, 'state': 'closed'},
}

while True:
    try:
        line = sys.stdin.readline().strip()
        if not line:
            break

        received_data = json.loads(line)
        frame_data = received_data.get('frame')

        if frame_data:
            decoded_frame = base64.b64decode(frame_data)
            nparr = np.frombuffer(decoded_frame, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is not None:
                frame = cv2.flip(frame, 1)
                image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results = pose.process(image)
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                if results.pose_landmarks:
                    mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
                    landmarks = results.pose_landmarks.landmark

                    left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
                    right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
                    left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]
                    right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]

                    hand_distance = abs(left_wrist.x - right_wrist.x)
                    foot_distance = abs(left_ankle.x - right_ankle.x)

                    if hand_distance > 0.4 and foot_distance > 0.4 and exercise_counters['jumping_jack']['state'] == 'closed':
                        exercise_counters['jumping_jack']['state'] = 'open'
                    elif hand_distance < 0.2 and foot_distance < 0.2 and exercise_counters['jumping_jack']['state'] == 'open':
                        exercise_counters['jumping_jack']['state'] = 'closed'
                        exercise_counters['jumping_jack']['count'] += 1

                    cv2.putText(image, f"Jumping Jacks: {exercise_counters['jumping_jack']['count']}", (50, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

                    ret, encoded_image = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    frame_to_send = base64.b64encode(encoded_image).decode('utf-8')
                    result_to_send = {"jumping_jack_count": exercise_counters['jumping_jack']['count'], "frame": frame_to_send}

                    print(json.dumps(result_to_send))
                    sys.stdout.flush()

                else:
                    print(json.dumps({"error": "No pose landmarks detected"}))
                    sys.stdout.flush()

            else:
                print(json.dumps({"error": "Could not decode frame"}))
                sys.stdout.flush()

        else:
            print(json.dumps({"error": "No frame data received"}))
            sys.stdout.flush()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}, Raw data: {line}")
    except EOFError:
        print("End of file reached. Exiting.")
        break
    except Exception as e:
        print(f"An error occurred: {e}")

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()