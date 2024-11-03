[![Build status](https://github.com/sctg-development/french-names-extractor/actions/workflows/build_and_release.yaml/badge.svg)](https://github.com/sctg-development/french-names-extractor/actions/workflows/build_and_release.yaml)
  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
  [![Rust](https://img.shields.io/badge/Rust-1.70%2B-blue.svg)](https://www.rust-lang.org)
  [![Cargo](https://img.shields.io/badge/Cargo-1.70%2B-blue.svg)](https://doc.rust-lang.org/cargo/)

# French Names Database Extractor

A Rust-based tool that creates a comprehensive database of French first names and last names by processing death records from INSEE (French National Institute of Statistics and Economic Studies).

## Star the project

**If you appreciate my work, please consider giving it a star! 🤩 or a** [![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/sctg-development)

## Motivation

The tool was created to extract and normalize first names and last names from INSEE death records data. The datas was extracted for creating a dataset with realistic names found in France for machine deep learning.

## Demonstration

A simple demonstration of a use case with the extracted data is available in the `username_generator` directory. The tool generates random usernames using the extracted first names and last names. The names are ponderated by their occurrences in the database. The Vue3 application is deployed on github pages: [https://sctg-development.github.io/french-names-extractor/](https://sctg-development.github.io/french-names-extractor/)

## Limits

The tool ignores the following cases:

- Names with one character
- Names containing only the same character
- By default it only stores names with more than one occurrence

## Features

- Processes multiple CSV files from INSEE death records
- Extracts and normalizes first names and last names
- Records gender information for first names
- Counts occurrences of each name
- Generates structured JSON output files
- Handles special cases and data cleanup

## Prerequisites

- Rust 1.70 or higher
- Cargo package manager

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/french-names-extractor
cd french-names-extractor

# Build the project
cargo build --release
```

## Usage

Command Line Options:  

- -p, --path : Directory containing INSEE CSV files (required)  
- -m, --multiple: true/false : store only occurrences > 1 (default: true)
- -c, --csv: true/false : also create csv files (default: false)
- -h, --help : Show help information  
- -V, --version : Display version information  

## Output Files

The tool generates two JSON files:

firstnames.json

```json
{
  "firstnames": [
    {
      "firstname": "jean",
      "sexe": 1,
      "occurrences": 1822998
    }
  ]
}
```

lastnames.json

```json
{
  "lastnames": [
    {
      "lastname": "dupont",
      "occurrences": 26339
    }
  ]
}
```

## Extracted Data

`firstnames.json`, `lastnames.json`, `firstnames.csv` and `lastnames.csv` in the repository are generated with INSEE death records data from 1970 to september 2024 (inclusive) with the parameter `-c true`.

## Data Source

The death records data is sourced from INSEE's public database: <https://www.insee.fr/fr/information/4769950>

## Machine Learning Dataset

The extracted data can be used to create a machine learning dataset for training models to generate realistic French names.
Two datasets are provided in Hugging Face's datasets library:

- https://huggingface.co/datasets/eltorio/french_first_names_insee_2024
```python
from datasets import load_dataset

ds = load_dataset("eltorio/french_first_names_insee_2024")
```

- https://huggingface.co/datasets/eltorio/french_last_names_insee_2024  
  
```python
from datasets import load_dataset

ds = load_dataset("eltorio/french_last_names_insee_2024")
```

## License

This project is licensed under the GNU Affero General Public License v3.0 - see the LICENSE.md file for details.

## Author

Copyright © 2024 Ronan LE MEILLAT
