import { tick } from 'svelte';
import { storedGames, totalGuesses, incorrectGuesses, correctGuesses, timer, games, type LocalStorageEntry, type LocalStorageContainer, neededToWin, wordOne, wordTwo, wordThree, wordFour, wordList, todaysSeed, todaysDate, isTimerPaused, successWord, dangerWord, todaysDateObj, timerObj } from './store';
import { get } from 'svelte/store';
import { getAlternades } from './lists';
import { DateTime } from 'luxon';

export function handleWebShare() {
  const shareData = {
    text: `Meganades ${get(todaysDateObj).toLocaleString(DateTime.DATE_MED)}\nTime: ${(get(timer) / 1000).toFixed(1)}\nTotal: ${get(totalGuesses)}\nIncorrect: ${get(incorrectGuesses)}\nAccuracy: ${Math.round((10 / get(totalGuesses)) * 100)}%\nhttps://www.meganades.com`,
  };


  try {
    navigator.share(shareData);
  } catch {}
}

export function getGames() {
    if (!JSON.parse(get(storedGames))) {
      const container: LocalStorageContainer = {
        games: [
          {
            datePlayed: get(todaysDate),
            totalGuesses: 0,
            incorrectGuesses: 0,
            correctGuesses: 0,
            time: 0,
            seed: get(todaysSeed)
          } as LocalStorageEntry,
        ],
      };

      storedGames.set(JSON.stringify(container));
    }

    return JSON.parse(get(storedGames));
  }

  export function createNewGame() {
    if (!getGame(get(todaysDate))) {
      const gameList = get(games);

      gameList.games.push({
        datePlayed: get(todaysDate),
        totalGuesses: 0,
        incorrectGuesses: 0,
        correctGuesses: 0,
        time: 0,
        seed: get(todaysSeed)
      } as LocalStorageEntry);
    }
  }

  export function getGame(dateStr: string): LocalStorageEntry | undefined {
    return get(games).games.find(game => game.datePlayed === dateStr);
  }

  export function save() {
    const entry = getGame(get(todaysDate));

    entry.totalGuesses = get(totalGuesses);
    entry.incorrectGuesses = get(incorrectGuesses);
    entry.correctGuesses = get(correctGuesses);
    entry.time = get(timer);
    entry.seed = get(todaysSeed);

    storedGames.set(JSON.stringify(get(games)));
  }

  export function saveTimer() {
    setInterval(() => {
      if (get(correctGuesses) !== 10) {
        save();
      }
    }, 100);
  }

  export function getSubWord(word: string, n: number): string {
    let returnString = "";

    for (let i = 0; i < word.length; i++) {
      if (i % 2 == n)
        returnString += word.charAt(i);
    }

    return returnString.toUpperCase();
  }

  export function setWords() {
    const entry = get(wordList)[get(correctGuesses) !== 10 ? get(correctGuesses) : 9];

    wordOne.set(entry.wordOne);
    wordTwo.set(entry.wordTwo);
    wordThree.set(entry.wordThree);
    wordFour.set(entry.wordFour);
  }

  export function continueGame() {
    const el = document.getElementById('continue-modal') as HTMLFormElement;
    el.close();

    startGame()
  }

  export function resetTimerObj() {

    let lastTime = window.performance.now();
    let frame;
    timerObj.set((function update() {
      if (get(isTimerPaused))
        return;

      frame = requestAnimationFrame(update);

      const time = window.performance.now();

      let timerValue = get(timer);

      timer.set(timerValue += time - lastTime);
      lastTime = time;
    })())
  }

  export function startGame() {
    const el = document.getElementById('start-modal') as HTMLFormElement;
    el.close();

    isTimerPaused.set(false);

    resetTimerObj();

    saveTimer();
  }

  export async function showModal(name: string) {
    await tick();
    
    const el = document.getElementById(name) as HTMLFormElement;
    el.showModal();
  }

  export function win() {
    isTimerPaused.set(true);
    save();
    
    showModal('win-modal');
  }

  function handleSuccessAnimationEnd() {
    const successBadge = document.getElementById("success-badge");

    successBadge.classList.add("animate__fadeOut", "animate__faster");
  }

  function handleDangerAnimationEnd() {
    const dangerBadge = document.getElementById("danger-badge");

    dangerBadge.classList.add("animate__fadeOut", "animate__faster");
  }

  function animateBadge(guessedCorrectly: boolean) {
    const successBadge = document.getElementById("success-badge");
    const dangerBadge = document.getElementById("danger-badge");

    successBadge.removeEventListener("animationend", handleSuccessAnimationEnd);
    dangerBadge.removeEventListener("animationend", handleDangerAnimationEnd);

    successBadge.classList.add("hidden");
    dangerBadge.classList.add("hidden");

    successBadge.classList.remove("animate__tada", "animate__fadeOut", "animate__faster");
    dangerBadge.classList.remove("animate__headShake", "animate__fadeOut", "animate__faster");

    successBadge.style.animation = 'none';
    successBadge.offsetHeight;
    successBadge.style.animation = null;

    dangerBadge.style.animation = 'none';
    dangerBadge.offsetHeight;
    dangerBadge.style.animation = null;

    if (guessedCorrectly) {
      successBadge.classList.remove("hidden");
      successBadge.classList.add("animate__tada");

      successBadge.addEventListener("animationend", handleSuccessAnimationEnd);
    } else {
      dangerBadge.classList.remove("hidden");
      dangerBadge.classList.add("animate__headShake");

      dangerBadge.addEventListener("animationend", handleDangerAnimationEnd);
    }
  }

  function getRandomWord(list: string[]) {
    const i = Math.floor(Math.random()*list.length);
    return list[i];
  }

  export function guess(word: string) {
    const successWords = ["Nice!", "Way to go!", "Awesome!", "Got it!", "Fantastic!"];
    const dangerWords = ["Oops!", "Not quite!", ":(", "Keep trying!", "Keep going!", "Tricky one..."];

    successWord.set(getRandomWord(successWords));
    dangerWord.set(getRandomWord(dangerWords));

    let totalGuessesValue = get(totalGuesses);
    totalGuesses.set(totalGuessesValue+=1);
    let guessedCorrectly = !!getAlternades().find(str => str === word);

    if (guessedCorrectly) {
      animateBadge(true);
      let correctGuessesValue = get(correctGuesses);
      correctGuesses.set(correctGuessesValue+=1);

      if (get(correctGuesses) === get(neededToWin))
        win();

      setWords();
    } else {
      animateBadge(false);
      let incorrectGuessesValue = get(incorrectGuesses);
      incorrectGuesses.set(incorrectGuessesValue+=1);
    }
  }