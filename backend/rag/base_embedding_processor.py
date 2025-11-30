import os
import json
import re
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass
from google import genai

@dataclass
class MetaItem:
    short_version: str
    meaning: str

@dataclass
class MetaInfo:
    file: str
    metaInfo: str


@dataclass
class SourceChunk:
    source: str
    text: str
    embedding: List[float] = None

ContentState = Dict[str, str]
MetaState = Dict[str, str]

class BaseEmbeddingProcessor:
    def __init__(self, model: str = "gemini-embedding-001", processed_dir: str = os.path.join("data", "processed"), embedding_dir: str = os.path.join("data", "embeddings"), skip_embedding_generation: bool = False):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        self.api_key = api_key
        self.model = model
        self.processed_dir = processed_dir
        self.embedding_dir = embedding_dir
        self.skip_embedding_generation = skip_embedding_generation
        self.chunk_size = 500
        self.overlap = 50

        Path(self.processed_dir).mkdir(parents=True, exist_ok=True)
        Path(self.embedding_dir).mkdir(parents=True, exist_ok=True)

    @staticmethod
    def clean_text(text: str) -> str:
        text = re.sub(r"[]+", "\n", text)
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    @staticmethod
    def chunk_text_helper(text: str, chunk_size: int, overlap: int) -> List[str]:
        words = text.split()
        chunks = []
        start = 0
        while start < len(words):
            end = start + chunk_size
            chunk = " ".join(words[start:end])
            chunks.append(chunk)
            if end >= len(words):
                break
            start = end - overlap
        return chunks

    def get_embeddings(self, chunks: List[SourceChunk]) -> List[SourceChunk]:
        client = genai.Client(api_key=self.api_key)
        print(f"Generating embeddings for {len(chunks)} chunks...")

        for c in chunks:
            response = client.models.embed_content(
                model=self.model,
                contents=c["text"]
            )
            c["embedding"] = response.embeddings[0].values
        return chunks

    def extract_logic(self, raw_text: str) -> Tuple[ContentState, List[MetaItem]]:
        raise NotImplementedError("You must implement extract_logic in your child class")

    def format_chunks(self, content_data: ContentState, source_filename: str) -> List[SourceChunk]:
        raise NotImplementedError("You must implement format_chunks in your child class")

    def format_meta_output(self, meta_data:  List[MetaItem], source_filename: str) -> List[MetaInfo]:
        raise NotImplementedError("You must implement format_meta_output in your child class")

    def process_file(self, input_file_path: str):
        file_path = Path(input_file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {input_file_path}")

        full_file_name = file_path.name
        if full_file_name.endswith(".txt"):
            full_file_name = full_file_name[:-4]

        print(f"--- Processing {full_file_name} ---")


        raw_text = file_path.read_text(encoding="utf-8")

        content, meta = self.extract_logic(raw_text)

        chunks = self.format_chunks(content, full_file_name)
        print(f"Created {len(chunks)} text chunks.")

        Path(os.path.join(self.processed_dir, f"{full_file_name}_INFO.json")).write_text(
            json.dumps(chunks, indent=4, ensure_ascii=False), encoding="utf-8"
        )
        Path(os.path.join(self.processed_dir, f"{full_file_name}_META.json")).write_text(
            json.dumps(meta, indent=4, ensure_ascii=False), encoding="utf-8"
        )
        print(f"Extracted content and saved to {self.processed_dir}")

        chunks_with_embeddings = self.get_embeddings(chunks) if not self.skip_embedding_generation else chunks

        embed_file = os.path.join(self.embedding_dir, f"{full_file_name}_EMBED.json")
        with open(embed_file, "w", encoding="utf-8") as f:
            json.dump(chunks_with_embeddings, f, ensure_ascii=False, indent=2)

        final_meta = self.format_meta_output(meta, full_file_name)
        meta_file = os.path.join(self.embedding_dir, f"{full_file_name}_META.json")
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(final_meta, f, ensure_ascii=False, indent=2)

        print(f"--- Processing of {full_file_name} completed ---")