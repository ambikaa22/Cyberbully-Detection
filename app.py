from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

try:
    # Load the trained model and TF-IDF vocabulary
    logger.info("Loading model files...")
    vectorizer = CountVectorizer(vocabulary=pickle.load(open('models/tfidf_vector_vocabulary.pkl', 'rb')))
    model = pickle.load(open('models/LinearSVC.pkl', 'rb'))
    logger.info("Model files loaded successfully")
except Exception as e:
    logger.error(f"Error loading model files: {str(e)}")
    raise

@app.route('/predict', methods=['POST'])
def predict():
    try:
        logger.info("Received prediction request")
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.json
        if 'text' not in data:
            logger.error("No text field in request")
            return jsonify({'error': 'No text field in request'}), 400

        text = data['text']
        logger.info(f"Processing text: {text[:100]}...")  # Log first 100 chars
        
        transformed_text = vectorizer.transform([text])
        prediction = model.predict(transformed_text)[0]
        
        result = {
            'prediction': int(prediction),
            'label': 'bullying' if prediction == 1 else 'non-bullying'
        }
        logger.info(f"Prediction result: {result}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
