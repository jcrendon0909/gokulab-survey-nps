from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from collections import Counter
import re
import os

app = Flask(__name__)
CORS(app)

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
        blob = TextBlob(cleaned)
        polarity = blob.sentiment.polarity
        # Umbrales más sensibles para español (textos cortos)
        if polarity > 0.05:
            sentiment = 'positive'
        elif polarity < -0.05:
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
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5002)), debug=True)