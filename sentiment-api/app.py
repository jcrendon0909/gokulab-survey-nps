from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from collections import Counter
import re

app = Flask(__name__)
CORS(app)

# Palabras vacías en español (ampliables)
STOPWORDS = {
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'porque',
    'que', 'de', 'en', 'con', 'para', 'por', 'sin', 'sobre', 'entre', 'hasta', 'desde',
    'durante', 'según', 'mediante', 'versus', 'vía', 'si', 'no', 'ni', 'ya', 'muy',
    'más', 'menos', 'así', 'cuando', 'donde', 'cómo', 'quién', 'qué', 'quien', 'cual'
}

def clean_text(text):
    """Limpia el texto: minúsculas, elimina puntuación y stopwords."""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)  # elimina puntuación
    words = text.split()
    words = [w for w in words if w not in STOPWORDS and len(w) > 2]
    return ' '.join(words)

def analyze_sentiment(text):
    """Clasifica el sentimiento del texto usando TextBlob."""
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity  # -1 a +1
    print(f"🔎 Texto: '{text}' -> Polaridad: {polarity}")  # LOG para depurar
    if polarity > 0.05:
        return 'positive'
    elif polarity < -0.05:
        return 'negative'
    else:
        return 'neutral'

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'comments' not in data:
        return jsonify({'error': 'No comments provided'}), 400

    comments = data['comments']
    # Filtrar comentarios vacíos o muy cortos
    comments = [c for c in comments if c and len(c.strip()) > 2]

    if not comments:
        return jsonify({'error': 'No valid comments'}), 400

    # Procesar cada comentario
    sentiments = {'positive': [], 'negative': [], 'neutral': []}
    for text in comments:
        cleaned = clean_text(text)
        if not cleaned:
            continue
        sentiment = analyze_sentiment(cleaned)
        sentiments[sentiment].append(cleaned)

    # Contar totales
    total = {
        'positive': len(sentiments['positive']),
        'negative': len(sentiments['negative']),
        'neutral': len(sentiments['neutral'])
    }

    # Palabras más frecuentes por sentimiento
    word_counts = {}
    for sent, texts in sentiments.items():
        all_words = ' '.join(texts).split()
        word_counts[sent] = Counter(all_words).most_common(20)

    return jsonify({
        'sentiments': total,
        'word_counts': word_counts
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)