import _firstNames from './../../firstnames.json';
import _lastNames from './../../lastnames.json';

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
    return name.normalize("NFD").replace(/'/g,"_").replace(/ /g,"_").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Returns a random first name from the array ponderated by the occurrences
 * @param data the firstnames data
 * @returns a random firstname
 */
export function randomFirstnamePonderated(data: Firstnames): string {
    // compute the total number of occurrences
    const total = data.firstnames.reduce((sum, current) => sum + current.occurrences, 0);

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
export function randomLastnamePonderated(data: Lastnames): string {
    // compute the total number of occurrences
    const total = data.lastnames.reduce((sum, current) => sum + current.occurrences, 0);

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
    return `${normalize(randomFirstnamePonderated(firstnames))}.${normalize(randomLastnamePonderated(lastnames))}`;
}