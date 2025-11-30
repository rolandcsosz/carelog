import os
from pdfminer.high_level import extract_text
from dotenv import load_dotenv
import json
from typing import TypedDict
import importlib

load_dotenv()

raw_dir = os.path.join("data", "raw")
processor_dir = os.path.join("data", "processed")
embeddings_dir = os.path.join("data", "embeddings")
model = "gemini-embedding-001"

class ProcessingInfo(TypedDict):
    name: str
    processor: str
    ignore_parsing: bool
    ignore_processing: bool


processing_info: list[ProcessingInfo] = [{
    "name": "gyik_hsg_2016_05_03.pdf",
    "processor": "processor_01.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "vonalvezeto_hsny_20190402.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=a0700036.smm.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=a1100112.tv.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=99300003.tv.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=99300029.kor.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=99900009.scm.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=a0000001.scm.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=a0000008.scm.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
},
{
    "name": "jogszabaly_docid=a0000009.scm.md",
    "processor": "processor_02.py",
    "ignore_parsing": False,
    "ignore_processing": False,
}]



os.makedirs(processor_dir, exist_ok=True)
os.makedirs(embeddings_dir, exist_ok=True)

def load_class(module_path: str, class_name: str):
    module = importlib.import_module(module_path)
    return getattr(module, class_name)


def process_pdf(file_path: str, out_path: str = processor_dir):
    if not file_path.lower().endswith(".pdf"):
        return

    try:
        print(f"Processing: {file_path}")
        text = extract_text(file_path)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Saved text to: {out_path}")
    except Exception as e:
        print(f"Failed to process {file_path}: {e}")

def get_all_files_in_folder(folder: str, extension: str):
    pdf_files = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(extension):
            pdf_files.append(os.path.join(folder, filename))
    return pdf_files


def process_files(file_list, extension):
    for file_path in file_list:
        file = os.path.basename(file_path)
        output_path = os.path.join(processor_dir, f"{file}.txt")

        processor_info = next((item for item in processing_info if item["name"] == file), None)
        if not processor_info:
            continue

        if not processor_info.get("ignore_parsing", False):
            if extension == ".pdf":
                process_pdf(file_path, output_path)
            elif extension == ".md":
                with open(file_path, "r", encoding="utf-8") as src, open(output_path, "w", encoding="utf-8") as dst:
                    dst.write(src.read())
        else:
            print(f"Skipping parsing for: {file}")

        skip_embedding_generation = processor_info.get("ignore_processing", False)
        processor_script = processor_info["processor"]
        print(f"Running processor from: {processor_script}")
        Processor = load_class(processor_script[:-3], "Processor")
        processor_instance = Processor(
            model=model,
            processed_dir=processor_dir,
            embedding_dir=embeddings_dir,
            skip_embedding_generation=skip_embedding_generation
        )
        processor_instance.process_file(output_path)

def main():
    pdf_files = get_all_files_in_folder(raw_dir, ".pdf")
    md_files = get_all_files_in_folder(raw_dir, ".md")

    process_files(pdf_files, ".pdf")
    process_files(md_files, ".md")

    json_files = get_all_files_in_folder(embeddings_dir, ".json")
    merged_embed_file = []
    merged_meta_file = []

    for json_file in json_files:
        if json_file.endswith("_EMBED.json"):
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                merged_embed_file.extend(data)
        if json_file.endswith("_META.json"):
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                merged_meta_file.extend(data)

    with open(os.path.join(embeddings_dir, "embeddings.json"), "w", encoding="utf-8") as f:
        json.dump(merged_embed_file, f, ensure_ascii=False, indent=4)

    with open(os.path.join(embeddings_dir, "meta.json"), "w", encoding="utf-8") as f:
        json.dump(merged_meta_file, f, ensure_ascii=False, indent=4)

    print("Merging completed.")


if __name__ == "__main__":
    main()
