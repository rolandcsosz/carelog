import re
import json
from pathlib import Path
from google import genai
import os
from typing import List
import sys

PROCESSED_DIR = "data/processed"
EMBEDDING_DIR = "data/embeddings"
OUTPUT_FILE = "data/embeddings/embeddings.json"
MODEL = "gemini-embedding-001"
CHUNK_SIZE = 500
OVERLAP = 50

def load_json(filename: str):
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)


def chunk_text(text, chunk_size, overlap):
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end >= len(words):
            break
        start = end - overlap  # overlap region
    return chunks


def create_chunks(qa_data):
    chunks = []

    for item in qa_data:
        question = item["question"].strip()
        answer = item["answer"].strip()

        # Split answer into chunks that will fit together with the question
        question_words = len(question.split())
        max_answer_words = max(50, CHUNK_SIZE - question_words)  # ensure positive
        answer_chunks = chunk_text(answer, max_answer_words, OVERLAP)

        for chunk in answer_chunks:
            text = f"Kérdés: {question}\nVálasz: {chunk}"
            chunks.append({
                "source": "gyik_hsg_2016_05_03.pdf",
                "text": text
            })

    return chunks


def get_embeddings(chunks: List[dict], model: str, api_key: str):
    client = genai.Client(api_key=api_key)

    for c in chunks:
        response = client.models.embed_content(
            model=model,
            contents=c["text"]
        )
        c["embedding"] = response.embeddings[0].values
    return chunks

def clean_text(text: str) -> str:
    text = re.sub(r"[]+", "\n", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_qna_pairs(text: str):
    parts = re.split(r"(Kérdés:|Válasz:)", text)
    qna_pairs = []
    current_question = None

    current_label = None
    buffer = ""

    for part in parts:
        part = part.strip()
        if part in ["Kérdés:", "Válasz:"]:
            # Save previous buffer
            if current_label == "Válasz" and current_question and buffer:
                qna_pairs.append({
                    "question": current_question.strip(),
                    "answer": buffer.strip()
                })
                current_question = None
                buffer = ""

            current_label = part.replace(":", "")
            buffer = ""
        else:
            buffer += " " + part
            if current_label == "Kérdés":
                current_question = buffer.strip()

    if current_label == "Válasz" and current_question and buffer:
        qna_pairs.append({
            "question": current_question.strip(),
            "answer": buffer.strip()
        })

    return qna_pairs


def extract_law_metadata(text: str):
    text = re.sub(r"\s+", " ", text)

    stop_marker = re.search(r"fontos[!:]?", text, re.IGNORECASE)
    if stop_marker:
        text = text[:stop_marker.start()]

    pattern = re.compile(
        r"(.+?)\s*\(\s*(?:a\s+)?továbbiakban:\s*([^)]+?)\s*\)",
        re.UNICODE | re.IGNORECASE
    )

    metadata = []
    for match in pattern.finditer(text):
        full_text = match.group(1).strip()
        short_version = match.group(2).strip().rstrip('.')
        metadata.append({
            "shortVersion": short_version,
            "meaning": full_text
        })

    return metadata


def build_text_block(meta_list):
    parts = []
    for m in meta_list:
        short = m.get("shortVersion", "").strip()
        meaning = m.get("meaning", "").strip()
        if short and meaning:
            parts.append(f"{short} jelentése {meaning}")
    return ", ".join(parts)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text_path = sys.argv[1]
    else:
        raise ValueError("Please provide the input text file path as a command-line argument")

    file_name = os.path.splitext(os.path.basename(input_text_path))[0]
    raw_text = Path(input_text_path).read_text(encoding="utf-8")
    cleaned = clean_text(raw_text)
    qna = extract_qna_pairs(cleaned)
    meta_data = extract_law_metadata(raw_text)

    Path(os.path.join(PROCESSED_DIR, f"{file_name}_QA.json")).write_text(json.dumps(qna, indent=4, ensure_ascii=False), encoding="utf-8")
    Path(os.path.join(PROCESSED_DIR, f"{file_name}_META.json")).write_text(json.dumps(meta_data, indent=4, ensure_ascii=False), encoding="utf-8")

    print(f"Extracted {len(qna)} Q&A pairs from {input_text_path}")
    print(f"Found {len(qna)} QA items and {len(meta_data)} meta entries.")

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable not set")

    chunks = create_chunks(qna)
    print(f"Created {len(chunks)} text chunks to embed.")

    chunks_with_embeddings = get_embeddings(chunks, MODEL, api_key)

    with open(os.path.join(EMBEDDING_DIR, f"{file_name}_EMBED.json"), "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

    text_block = build_text_block(meta_data)

    output = [
        {
            "file": file_name + ".pdf",
            "metaInfo": text_block
        }
    ]

    with open(os.path.join(EMBEDDING_DIR, f"{file_name}_META.json"), "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Done! Embeddings saved to {OUTPUT_FILE}")