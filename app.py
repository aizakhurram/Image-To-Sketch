from flask import Flask, request, send_file
from flask_cors import CORS
import cv2
import numpy as np
from io import BytesIO

app = Flask(__name__)
CORS(app)

def convert_to_sketch(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted_image = cv2.bitwise_not(gray_image)
    blurred_image = cv2.GaussianBlur(inverted_image, (21, 21), sigmaX=0, sigmaY=0)
    inverted_blur = cv2.bitwise_not(blurred_image)
    sketch_image = cv2.divide(gray_image, inverted_blur, scale=256.0)
    normalized_sketch = cv2.normalize(sketch_image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)
    
    # Convert the sketch to a binary image where outlines are black and background is light gray
    _, binary_sketch = cv2.threshold(normalized_sketch, 255, 370, cv2.THRESH_BINARY_INV)
    
    # Make the background light gray and the outlines black
    final_sketch = cv2.bitwise_and(normalized_sketch, binary_sketch)
    
    # Enhance the contrast and brightness of the sketch
    # enhanced_sketch = cv2.convertScaleAbs(sketch_image, alpha=1, beta=-50)
    
    return final_sketch

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['image']
    if not file:
        return "No file uploaded", 400

    in_memory_file = BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)

    if data.size == 0:
        return "Failed to read image data", 400

    image = cv2.imdecode(data, cv2.IMREAD_COLOR)
    
    if image is None:
        return "Failed to decode image", 400
    
    # Proceed with sketch conversion
    sketch_image = convert_to_sketch(image)
   
    _, buffer = cv2.imencode('.png', sketch_image)
    sketch_file = BytesIO(buffer)
        
    return send_file(sketch_file, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
