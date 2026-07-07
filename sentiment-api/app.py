from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from collections import Counter
import re

app = Flask(__name__)
CORS(app)

# Cargar el pipeline de análisis de sentimiento en español
sentiment_pipeline = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

STOPWORDS = {'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'porque', 'que', 'de', 'en', 'con', 'para', 'por', 'sin', 'sobre', 'entre', 'hasta', 'desde', 'durante', 'según', 'mediante', 'versus', 'vía', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras'}

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    words = [w for w in words if w not in STOPWORDS and len(w) > 2]
    return ' '.join(words)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    comments = data.get('comments', [])
    if not comments:
        return jsonify({'error': 'No comments provided'}), 400

    results = []
    sentiments = {'positive': [], 'negative': [], 'neutral': []}
    for text in comments:
        if not text or len(text) < 3:
            continue
        cleaned = clean_text(text)
        if not cleaned:
            continue
        # Obtener sentimiento
        result = sentiment_pipeline(cleaned)[0]
        label = result['label']
        # Mapear a nuestro formato (el modelo usa estrellas 1-5)
        if '5' in label or '4' in label:
            sentiment = 'positive'
        elif '1' in label or '2' in label:
            sentiment = 'negative'
        else:
            sentiment = 'neutral'
        results.append({'text': text, 'sentiment': sentiment})
        sentiments[sentiment].append(cleaned)

    word_counts = {}
    for sent, texts in sentiments.items():
        all_words = ' '.join(texts).split()
        word_counts[sent] = Counter(all_words).most_common(20)

    return jsonify({
        'sentiments': {
            'positive': len(sentiments['positive']),
            'negative': len(sentiments['negative']),
            'neutral': len(sentiments['neutral'])
        },
        'word_counts': word_counts,
        'details': results
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(port=5002, debug=True)