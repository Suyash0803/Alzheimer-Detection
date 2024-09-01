from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS  # CORS for handling Cross-Origin Resource Sharing
import pickle
import logging
import re
import string
from preprocess import preprocess_text

app = Flask(__name__)

# Enable CORS for all routes, allowing requests from any origin
CORS(app, resources={r"/*": {"origins": "*"}})

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Load models and vectorizer
model_control_path = r"C:/Users/DELL/strapiC/Alzheimer-Detection-1/Alzheimer-Detection/backend/model_control.pkl"
model_alz_path = r"C:/Users/DELL/strapiC/Alzheimer-Detection-1/Alzheimer-Detection/backend/model_alz.pkl"

logging.info('Loading models...')
with open(model_control_path, 'rb') as f:
    model_control, weights_control = pickle.load(f)
logging.info('Model control loaded.')

with open(model_alz_path, 'rb') as f:
    model_alz, weights_alz = pickle.load(f)
logging.info('Model Alzheimer loaded.')

@app.route('/', methods=['GET'])
def get_data():
    data = {
        "message": "API is Running"
    }
    return jsonify(data)

# Define a route for making predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        logging.info('Received prediction request.')
        text = request.get_json()
        features = preprocess_text(text['data'])
        logging.info('Text preprocessed.')

        prob_control = model_control.predict_proba(features.multiply(weights_control))
        prob_alz = model_alz.predict_proba(features.multiply(weights_alz))
        logging.info(f'Control probabilities: {prob_control}')
        logging.info(f'Alzheimer probabilities: {prob_alz}')

        prediction = 1 if prob_control[0][1] > prob_alz[0][1] else 0
        confidence = prob_control[0][1] if prediction == 1 else prob_alz[0][0]
        
        logging.info(f'Prediction: {prediction}, Confidence: {confidence}')

        return jsonify({
            'Prediction': prediction,
            'Confidence': confidence
        })
    except Exception as e:
        logging.error(f'Error during prediction: {str(e)}')
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
