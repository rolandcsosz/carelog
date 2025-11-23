# RAG (Retrieval-Augmented Generation) Module

## Overview

This module processes text documents to create vector embeddings. This module uses python libraries listed in `requirements.txt`.

The input pdfs files placed in the `data/raw` folder. `data/raw.sources.csv` contains the list of source files with the url of each source. On generation of embeddings `data/raw` folder is processed. For every pdf the txt version created in the `data/processed` folder. The final embeddings are stored in the `data/embeddings` folder. Each embedding file has `_EMBED.json` suffix. If any metadata is needed, a corresponding `_META.json` file is created in the same folder. The `generate.py` script search for every json file in the `data/embeddings` folder which has `_EMBED.json` and `_META.json` suffix. Then they are merged into a single `embeddings.json` and `meta.json` file in the same folder.

Files used by outer systems are:

- `data/embeddings/embeddings.json`: Contains all the vector embeddings for the documents.
- `data/embeddings/meta.json`: Contains metadata information for the documents.
- `data/raw/sources.csv`: Contains the list of source files with the url of each source.

## Setup

1. Install the required dependencies:

   ```bash
   pip install -r requirements.txt

2. Rename `.env.example` to `.env` and set the necessary environment variables like `GOOGLE_API_KEY`.

## Regenerating Embeddings

To regenerate the embeddings for the documents, run the following command:

```bash
python generate.py
```

Note that this will process all documents in the `data/raw` folder and regenerate the embeddings in the `data/embeddings` folder. If you want to exclued certain documents, you can modify the `processor_mapping` in `generate.py` script accordingly. If no prcessor is found for a document, it will be skipped.

## Add New Documents

To add new documents for embedding generation, follow these steps:

1. Place the new document files in the `data/raw` folder.
2. Update the `data/raw/sources.csv` file to include the new documents and their corresponding URLs.
3. Create a python processor script which:
   - First argument of the script is the path to the txt document after parsing the corresponding pdf file. `generate.py` will create the txt file in the `data/processed` folder before calling the processor script.
   - Store any intermediate files in the `data/processed` folder.
   - Output the final processed data in the `data/embeddings` folder. The embeddings should have `_EMBED.json` suffix. If metadata is needed, create a `_META.json` file in the same folder.
   - Ensure the output EMBED.json has the follwing data schema:

        ```json
        [{
            "source": "gyik_hsg_2016_05_03.pdf",
            "embedding": [...],
            "text": "Kérdés: Ha az ellátott a felülvi..."
        }]
   - Ensure the output META.json has the follwing data schema:

       ```json
       [{
            "file": "gyik_hsg_2016_05_03.pdf",
            "metaInfo": "Kvt jelentése NEMZETI REHABILITÁCIÓS...",
       }]
       ```

   - Ensure the "source" field in the EMBED.json matches the filename of the document being processed. Also ensure the "file" field in the META.json matches the filename of the document being processed.

4. In `generate.py`, update the `processor_mapping` dictionary to include the new document type and its corresponding processor script. like:

    ```python
    processor_mapping = {
        "gyik_hsg_2016_05_03.pdf": "process_01.py",
    }
    ```

5. Regenerate them discussed in the previous section.
