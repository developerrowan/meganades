import { writable } from 'svelte/store';
import type { ListEntry } from './lists';
import { DateTime } from 'luxon';

export const totalGuesses = writable(0);
export const incorrectGuesses = writable(0);
export const correctGuesses = writable(0);
export const neededToWin = writable(10);

export const wordOne = writable("");
export const wordTwo = writable("");
export const wordThree = writable("");
export const wordFour = writable("");

export const successWord = writable("");
export const dangerWord = writable("");

export const wordList = writable([] as ListEntry[]);
export const todaysDate = writable("");
export const todaysDateObj = writable(DateTime.now());
export const todaysSeed = writable(0);

export const timer = writable(0);
export const isTimerPaused = writable(true);
export const timerObj = writable(null);

export const showAnswerExplanations = writable(false);
export const alternadesList = writable([] as string[]);

export const games = writable({} as LocalStorageContainer);

export interface LocalStorageContainer {
    games: LocalStorageEntry[];
}

export interface LocalStorageEntry {
    datePlayed: string;
    totalGuesses: number;
    incorrectGuesses: number;
    correctGuesses: number;
    time: number;
    seed: number;
}

const previousGames = localStorage.getItem("localStorageContainer");
export const storedGames = writable(previousGames);

storedGames.subscribe(value => {
    localStorage.setItem("localStorageContainer", value);
});