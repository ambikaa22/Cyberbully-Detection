from flask import Flask, request, jsonify
import pickle
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from flask_cors import CORS  # 👈 Add CORS support

app = Flask(__name__)
CORS(app)  # 👈 Allow requests from frontend

# Load the trained model and TF-IDF vocabulary
try:
    vectorizer = CountVectorizer(vocabulary=pickle.load(open('models/tfidf_vector_vocabulary.pkl', 'rb')))
    model = pickle.load(open('models/LinearSVC.pkl', 'rb'))
    print("✅ Model and TF-IDF vectorizer loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# Prediction route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json.get('text', '')

        if not data:
            return jsonify({'error': 'No text provided'}), 400
        
        transformed_text = vectorizer.transform([data])
        prediction = model.predict(transformed_text)[0]

        return jsonify({
            'prediction': int(prediction),
            'label': 'bullying' if prediction == 1 else 'non-bullying'
        })
    
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {e}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
