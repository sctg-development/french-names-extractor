// Copyright ⓒ 2024 Ronan LE MEILLAT
// Licensed under the Affero General Public License version 3 or later
use clap::{crate_version, Arg, Command};
use csv::ReaderBuilder;
use csv::Writer;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::error::Error;
use std::fs::{self, File};

#[derive(Serialize, Deserialize)]
pub struct Firstname {
    pub firstname: String,
    pub sexe: Option<u8>,
    pub occurrences: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Firstnames {
    pub firstnames: Vec<Firstname>,
}

#[derive(Serialize, Deserialize)]
pub struct Lastname {
    pub lastname: String,
    pub occurrences: u32,
}

#[derive(Serialize, Deserialize)]
pub struct Lastnames {
    pub lastnames: Vec<Lastname>,
}

fn main() -> Result<(), Box<dyn Error>> {
    let matches = Command::new("INSEE CSV Deaths Extractor")
        .version(crate_version!())
        .about("Processes CSV files to extract firstnames and lastnames")
        .arg(
            Arg::new("path")
                .short('p')
                .long("path")
                .value_name("PATH")
                .help("Path containing all the INSEE csv files")
                .required(true),
        )
        .arg(
            Arg::new("multiple")
                .short('m')
                .long("multiple")
                .value_parser(clap::value_parser!(bool))
                .default_value("true")
                .help("Store only firstnames and lastnames with multiple occurrences")
                .required(false),
        )
        .arg(
            Arg::new("csv")
                .short('c')
                .long("csv")
                .value_parser(clap::value_parser!(bool))
                .default_value("false")
                .help("Create also csv files")
                .required(false),
        )
        .get_matches();

    let path = matches.get_one::<String>("path").unwrap();
    let has_multiple = matches.contains_id("multiple");
    let min_occurence = if has_multiple { 1 } else { 0 };
    let has_csv = matches.contains_id("csv");
    let csv = if has_csv { true } else { false };

    let mut firstnames_map: HashMap<(String, Option<u8>), u32> = HashMap::new();
    let mut lastnames_map: HashMap<String, u32> = HashMap::new();

    for entry in fs::read_dir(path)? {
        let entry = entry?;
        let path = entry.path();

        if path.extension().and_then(|s| s.to_str()) == Some("csv") {
            println!("Processing file: {:?} ... ", path);
            let file = File::open(&path)?;
            let mut rdr = ReaderBuilder::new().delimiter(b';').from_reader(file);

            for result in rdr.records() {
                let record = result?;
                let nomprenom = &record[0];
                let sexe = record[1].parse::<u8>().ok();

                // Split name and firstnames
                if let Some((nom, prenoms)) = nomprenom.split_once('*') {
                    // Ignore names with less than 2 characters, empty names and names containing only the same letter
                    if !(nom.len() < 2 || nom.chars().all(|c| c == nom.chars().next().unwrap())) {
                        *lastnames_map
                            .entry(nom.to_string().to_lowercase())
                            .or_insert(0) += 1;
                    }

                    // Traiter les prénoms
                    if let Some(prenoms_clean) = prenoms.strip_suffix('/') {
                        for prenom in prenoms_clean.split_whitespace() {
                            // ignore prenoms with less than 2 characters, empty prenoms and prenoms containing only the same letter
                            if !(prenom.len() < 2
                                || prenom.chars().all(|c| c == prenom.chars().next().unwrap()))
                            {
                                *firstnames_map
                                    .entry((prenom.to_string().to_lowercase(), sexe))
                                    .or_insert(0) += 1;
                            }
                        }
                    }
                }
            }
        }
    }

    // Create Firstnames and Lastnames structs
    let mut firstnames = Firstnames {
        firstnames: firstnames_map
            .into_iter()
            .filter(|((_, _), occurrences)| *occurrences > min_occurence)
            .map(|((firstname, sexe), occurrences)| Firstname {
                firstname,
                sexe,
                occurrences,
            })
            .collect(),
    };

    let mut lastnames = Lastnames {
        lastnames: lastnames_map
            .into_iter()
            .filter(|(_, occurrences)| *occurrences > min_occurence)
            .map(|(lastname, occurrences)| Lastname {
                lastname,
                occurrences,
            })
            .collect(),
    };

    // Sort Firstnames and Lastnames by occurrences descending
    firstnames
        .firstnames
        .sort_by(|a, b| b.occurrences.cmp(&a.occurrences));
    lastnames
        .lastnames
        .sort_by(|a, b| b.occurrences.cmp(&a.occurrences));

    // Write to json files
    std::fs::write(
        "firstnames.json",
        serde_json::to_string_pretty(&firstnames)?,
    )?;
    std::fs::write("lastnames.json", serde_json::to_string_pretty(&lastnames)?)?;

    // Write to csv files
    if csv {
        let mut wtr = Writer::from_path("firstnames.csv")?;
        //wtr.write_record(&["firstname", "sexe", "occurrences"])?;
        for firstname in firstnames.firstnames.iter() {
            wtr.serialize(firstname)?;
        }
        wtr.flush()?;
        let mut wtr = Writer::from_path("lastnames.csv")?;
        //wtr.write_record(&["lastname", "occurrences"])?;
        for lastname in lastnames.lastnames.iter() {
            wtr.serialize(lastname)?;
        }
    }
    Ok(())
}
