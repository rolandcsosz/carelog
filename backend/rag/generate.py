import os
from pdfminer.high_level import extract_text
from dotenv import load_dotenv
import json

load_dotenv()

raw_dir = "data/raw"
processor_dir = "data/processed"
embeddings_dir = "data/embeddings"
processor_mapping = {
    "gyik_hsg_2016_05_03.pdf": "process_01.py",
}


os.makedirs(processor_dir, exist_ok=True)

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

def main():
    pdf_files = get_all_files_in_folder(raw_dir, ".pdf")

    for pdf_file in pdf_files:
        file_name = os.path.splitext(os.path.basename(pdf_file))[0]
        output_path = os.path.join(processor_dir, f"{file_name}.txt")
        process_pdf(pdf_file, output_path)
        if os.path.basename(pdf_file) in processor_mapping:
            processor_script = processor_mapping[os.path.basename(pdf_file)]
            print(f"Running processor script: {processor_script}")
            os.system(f"python {processor_script} {output_path}")

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
