import re
from typing import List, Tuple
from base_embedding_processor import BaseEmbeddingProcessor, MetaInfo, MetaItem, SourceChunk, ContentState, MetaState

class Processor(BaseEmbeddingProcessor):

    def extract_logic(self, raw_text: str) -> Tuple[ContentState, List[MetaItem]]:
        cleaned = self.clean_text(raw_text)

        text = re.sub(r"\*\*(.*?)\*\*", r"\1", cleaned)
        text = text.replace("|", " ")
        text = re.sub(r"[^a-zA-Z0-9áéíóöőúüűÁÉÍÓÖŐÚÜŰ.,;:()\-/–\s]", " ", text)
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"(\d+)\)\s*", r"\1. ", text)
        text = re.sub(r"(?<=\.)\s+(?=[IVX]+\.)", "\n\n", text)
        text = text.strip()

        return {"text": text}, []

    def format_chunks(self, content_data: ContentState, source_filename: str) -> List[SourceChunk]:
        chunks = []
        text_chunks = self.chunk_text_helper(content_data.get("text", ""), self.chunk_size, self.overlap)
        for item in text_chunks:
            chunks.append({
                "source": source_filename,
                "text": item,
                "embedding": []
            })
        return chunks

    def format_meta_output(self, meta_data:  List[MetaItem], source_filename: str) -> List[MetaInfo]:
        return []