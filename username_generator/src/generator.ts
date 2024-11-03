import _firstNames from './../../firstnames.json';
import _lastNames from './../../lastnames.json';

// Exporting the imported data with explicit typecasting to ensure data integrity
export const firstNames = _firstNames as Firstnames;
export const lastNames = _lastNames as Lastnames;

export interface Firstname {
    firstname: string;
    sexe?: number;
    occurrences: number;
}

export interface Firstnames {
    firstnames: Firstname[];
}

export interface Lastname {
    lastname: string;
    occurrences: number;
}

export interface Lastnames {
    lastnames: Lastname[];
}

/**
 * Return a normalized version of the name (lowercase, no accent, no special characters)
 * @param name the name to normalize
 * @returns the normalized name
 */
export function normalize(name: string): string {
    // Perform Unicode Normalization to decompose the string into its constituent parts
    return name.normalize("NFD")
        // Replace apostrophes with underscores
        .replace(/'/g, "_")
        // Replace spaces with underscores
        .replace(/ /g, "_")
        // Remove accent characters
        .replace(/[\u0300-\u036f]/g, "")
        // Convert the string to lowercase
        .toLowerCase();
}

/**
 * Precompute the cumulative sums for the given data
 * @param data the data to precompute cumulative sums for
 * @returns the cumulative sums
 */
export function precomputeCumulativeSums(data: (Firstname | Lastname)[]): number {
    return data.reduce((sum, current) => sum + current.occurrences, 0);
}

/**
 * Returns a random first name from the array ponderated by the occurrences
 * @param data the firstnames data
 * @param precomputedTotal the precomputed total number of occurrences
 * @returns a random firstname
 */
export function randomFirstnamePonderated(data: Firstnames, precomputedTotal: number | undefined): string {
    // If precomputed total is undefined, calculate the total occurrences
    let total = 0;
    if (precomputedTotal === undefined) {
        total = precomputeCumulativeSums(data.firstnames);
    } else {
        total = precomputedTotal;
    }


    // Generate a random number between 0 and total
    const randomValue = Math.floor(Math.random() * total);

    // Find the firstname corresponding to the random number
    let cumsum = 0;
    for (const firstname of data.firstnames) {
        cumsum += firstname.occurrences;
        if (randomValue < cumsum) {
            return firstname.firstname;
        }
    }

    throw new Error("No firstname found");
}

/**
 * Returns a random lastname from the array ponderated by the occurrences
 * @param data the lastnames data
 * @returns a random lastname
 */
export function randomLastnamePonderated(data: Lastnames, precomputedTotal: number | undefined): string {
    // If precomputed total is undefined, calculate the total occurrences
    let total = 0;
    if (precomputedTotal === undefined) {
        total = precomputeCumulativeSums(data.lastnames);
    } else {
        total = precomputedTotal;
    }

    // Generate a random number between 0 and total
    const randomValue = Math.floor(Math.random() * total);

    // Find the lastname corresponding to the random number
    let cumsum = 0;
    for (const lastname of data.lastnames) {
        cumsum += lastname.occurrences;
        if (randomValue < cumsum) {
            return lastname.lastname;
        }
    }

    throw new Error("No lastname found");
}

/**
 * Generate a random username
 * @param firstnames the firstnames data
 * @param lastnames the lastnames data
 * @returns a random username
 */
export function generateUsername(firstnames: Firstnames, lastnames: Lastnames): string {
    // Generate a random first name and normalize it
    const firstname = normalize(randomFirstnamePonderated(firstnames, undefined));
    // Generate a random last name and normalize it
    const lastname = normalize(randomLastnamePonderated(lastnames, undefined));
    // Combine the first name and last name with a dot in between to form the username
    return `${firstname}.${lastname}`;
}