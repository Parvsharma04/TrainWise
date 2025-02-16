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
    'squat': {'count': 0, 'state': 'up'},
    'pushup': {'count': 0, 'state': 'up'},
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

                    left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP].y]
                    right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y]
                    left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE].y]
                    right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE].y]
                    left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE].y]
                    right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE].y]

                    left_angle = calculate_angle(left_hip, left_knee, left_ankle)
                    right_angle = calculate_angle(right_hip, right_knee, right_ankle)
                    avg_angle = (left_angle + right_angle) / 2

                    if avg_angle < 90 and exercise_counters['squat']['state'] == 'up':
                        exercise_counters['squat']['state'] = 'down'
                    if avg_angle > 160 and exercise_counters['squat']['state'] == 'down':
                        exercise_counters['squat']['state'] = 'up'
                        exercise_counters['squat']['count'] += 1

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

                    cv2.putText(image, f"Squats: {exercise_counters['squat']['count']}", (50, 50),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
                    cv2.putText(image, f"Push-ups: {exercise_counters['pushup']['count']}", (50, 100),
                                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

                    ret, encoded_image = cv2.imencode('.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 80])
                    frame_to_send = base64.b64encode(encoded_image).decode('utf-8')
                    result_to_send = {"squat_count": exercise_counters['squat']['count'], "pushup_count": exercise_counters['pushup']['count'], "frame": frame_to_send}

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