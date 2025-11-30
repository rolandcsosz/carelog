import re
from typing import List, Tuple
from base_embedding_processor import BaseEmbeddingProcessor, MetaInfo, MetaItem, SourceChunk, ContentState, MetaState

class Processor(BaseEmbeddingProcessor):

    def extract_logic(self, raw_text: str) -> Tuple[ContentState, List[MetaItem]]:
        cleaned = self.clean_text(raw_text)

        parts = re.split(r"(Kérdés:|Válasz:)", cleaned)
        qna_pairs = []
        current_question = None
        current_label = None
        buffer = ""

        for part in parts:
            part = part.strip()
            if part in ["Kérdés:", "Válasz:"]:
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
            qna_pairs.append({"question": current_question.strip(), "answer": buffer.strip()})


        meta_text = re.sub(r"\s+", " ", raw_text)
        stop_marker = re.search(r"fontos[!:]?", meta_text, re.IGNORECASE)
        if stop_marker:
            meta_text = meta_text[:stop_marker.start()]

        pattern = re.compile(r"(.+?)\s*\(\s*(?:a\s+)?továbbiakban:\s*([^)]+?)\s*\)", re.UNICODE | re.IGNORECASE)
        metadata = []
        for match in pattern.finditer(meta_text):
            metadata.append({
                "shortVersion": match.group(2).strip().rstrip('.'),
                "meaning": match.group(1).strip()
            })

        return qna_pairs, metadata

    def format_chunks(self, content_data: ContentState, source_filename: str) -> List[SourceChunk]:
        chunks = []
        for item in content_data:
            question = item["question"].strip()
            answer = item["answer"].strip()

            question_words = len(question.split())
            max_answer_words = max(self.overlap, self.chunk_size - question_words)

            answer_chunks = self.chunk_text_helper(answer, max_answer_words, self.overlap)

            for chunk in answer_chunks:
                formatted_text = f"Kérdés: {question}\nVálasz: {chunk}"
                chunks.append({
                    "source": source_filename,
                    "text": formatted_text,
                    "embedding": []
                })
        return chunks

    def format_meta_output(self, meta_data:  List[MetaItem], source_filename: str) -> List[MetaInfo]:
        parts = []
        for m in meta_data:
            short = m.get("shortVersion", "").strip()
            meaning = m.get("meaning", "").strip()
            if short and meaning:
                parts.append(f"{short} jelentése {meaning}")

        text_block = ", ".join(parts)

        return [{
            "file": source_filename,
            "metaInfo": text_block
        }]