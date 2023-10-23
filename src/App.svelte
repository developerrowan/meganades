<script lang="ts">
  import { generateWordList, getSeed } from './lib/data/lists';
  import Header from './lib/components/Header.svelte';
  import { DateTime } from 'luxon';
  import { totalGuesses, incorrectGuesses, correctGuesses, neededToWin, timer, games, wordList, todaysSeed, todaysDate, wordOne, wordTwo, wordThree, wordFour, isTimerPaused, successWord, dangerWord, todaysDateObj } from './lib/data/store';
  import { createNewGame, getGame, getGames, guess, setWords, showModal } from './lib/data/gameManager';

  wordList.set(generateWordList());
  const dt = DateTime.now().startOf('day');
  todaysDateObj.set(dt);
  todaysDate.set(dt.toString());
  todaysSeed.set(getSeed());
  games.set(getGames());

  createNewGame();

  const alreadyPlayedToday = getGame($todaysDate);

  if (alreadyPlayedToday) {
    const g = alreadyPlayedToday;

    totalGuesses.set(g.totalGuesses);
    incorrectGuesses.set(g.incorrectGuesses);
    correctGuesses.set(g.correctGuesses);
    timer.set(g.time);

    if (g.correctGuesses === 10)
      showModal('win-modal');
    else if (g.correctGuesses > 0 || g.time > 0)
      showModal('continue-modal');
    else
      showModal('start-modal');
  } else {
    showModal('start-modal');
  }

  setWords();
</script>

<main class="flex flex-col min-h-screen">
  <Header />
  <div id="gamearea" class="flex flex-1">
    <div class="flex flex-col flex-grow justify-center items-center">
      <div id="success-badge" class={`absolute badge badge-lg badge-success mb-96 animate__animated hidden`}>
        {$successWord}
      </div>
      <div id="danger-badge" class={`absolute badge badge-lg badge-error mb-96 animate__animated hidden`}>
        {$dangerWord}
      </div>
      <div class="grid grid-row-4 grid-cols-2 gap-4">
        <p class="row-span-1 col-span-2 text-center">{($timer / 1000).toFixed(1)}</p>
        <button on:click={()=>guess($wordOne)} class="row-span-1 col-span-1 btn btn-lg word-button uppercase">{$wordOne}</button>
        <button on:click={()=>guess($wordTwo)} class="row-span-1 col-span-1 btn btn-lg word-button uppercase">{$wordTwo}</button>
        <button on:click={()=>guess($wordThree)} class="row-span-1 col-span-1 btn btn-lg word-button uppercase">{$wordThree}</button>
        <button on:click={()=>guess($wordFour)} class="row-span-1 col-span-1 btn btn-lg word-button uppercase">{$wordFour}</button>
        <p class="row-span-1 col-span-2 text-center">{$correctGuesses} / {$neededToWin}</p>
      </div>
    </div>
  </div>
  <div class="h-10 text-center">
    <i>Beta</i>
  </div>
</main>