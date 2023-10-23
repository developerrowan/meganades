<script lang="ts">
  import { continueGame, getSubWord, handleWebShare, startGame } from '../data/gameManager';
  import { alternadesList, correctGuesses, incorrectGuesses, neededToWin, showAnswerExplanations, timer, totalGuesses } from '../data/store';

  function showHelpModal() {
    const el = document.getElementById('how-to-play-modal') as HTMLFormElement;
    el.showModal();
  }
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Meganades</a>
    </div>
    <div class="flex-none">
      <button class="btn btn-square btn-ghost" on:click={showHelpModal}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width={1.5} stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>        
      </button>
    </div>
      <!-- Open the modal using ID.showModal() method -->
<dialog id="how-to-play-modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-center">How to Play</h3>
    <p class="py-2">The goal of this game is to identify 10 alternades.</p>
    <p class="pb-3">An alternade is a word in which sequences of alternating letters make up at least two other words. <b>All letters must be used.</b></p>
    <p class="pb-2">For example:</p>
    <p class="pb-2"><b>PAINED</b> = <kbd class="kbd-sm">PIE</kbd> and <kbd class="kbd-sm">AND</kbd></p>
    <p class="pb-2"><b>SCHOOLED</b> = <kbd class="kbd-sm">SHOE</kbd> and <kbd class="kbd-sm">COLD</kbd></p>
    <p class="pb-3"><b>BOARD</b> = <kbd class="kbd-sm">BAD</kbd> and <kbd class="kbd-sm">OR</kbd></p>
    <p class="pb-2">The words do not have to be the same length, as demonstrated.</p>
    <p class="pb-4">Each round you will be presented with four words. Identify the alternade. Do this as fast as you can with as few mistakes as possible!</p>
    <p class="pb-4"><b>Some alternades may seem nonsensical. Please note all words are legal, however progress is being made to refine the word list.</b></p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
<dialog id="start-modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-center">How to Play</h3>
    <p class="py-2">The goal of this game is to identify 10 alternades.</p>
    <p class="pb-3">An alternade is a word in which sequences of alternating letters make up at least two other words. <b>All letters must be used.</b></p>
    <p class="pb-2">For example:</p>
    <p class="pb-2"><b>PAINED</b> = <kbd class="kbd-sm">PIE</kbd> and <kbd class="kbd-sm">AND</kbd></p>
    <p class="pb-2"><b>SCHOOLED</b> = <kbd class="kbd-sm">SHOE</kbd> and <kbd class="kbd-sm">COLD</kbd></p>
    <p class="pb-3"><b>BOARD</b> = <kbd class="kbd-sm">BAD</kbd> and <kbd class="kbd-sm">OR</kbd></p>
    <p class="pb-2">The words do not have to be the same length, as demonstrated.</p>
    <p class="pb-4">Each round you will be presented with four words. Identify the alternade. Do this as fast as you can with as few mistakes as possible!</p>
    <p class="pb-4"><b>Some alternades may seem nonsensical. Please note all words are legal, however progress is being made to refine the word list.</b></p>

    <div class="flex flex-col items-center justify-center">
      <button on:click={startGame} class="btn btn-md">Begin</button>
    </div>
  </div>
</dialog>
<dialog id="win-modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-center">You did it!</h3>
    <p class="py-2 text-center"><b>Time: {($timer / 1000).toFixed(1)}</b></p>
    <p class="py-2 text-center"><b>Total guesses: {$totalGuesses}</b></p>
    <p class="py-2 text-center"><b>Incorrect guesses: {$incorrectGuesses}</b></p>
    <p class="py-2 text-center"><b>Accuracy: {Math.round((10 / $totalGuesses) * 100)}%</b></p>
    <p class="py-2 text-center"><b>You can play again tomorrow!</b></p>

    <div class="flex flex-col items-center justify-center">
      <button on:click={handleWebShare} class="btn btn-md">Share <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
      </button>
    </div>
    <p class="pt-4 text-center"><a on:click={()=>showAnswerExplanations.set(!$showAnswerExplanations)}><i>Press to see answer explanations</i></a></p>

    {#if $showAnswerExplanations}
      {#each $alternadesList as alternade, i}
        <p class="pb-1"><i><b>Round {i + 1}</b></i></p>
        <p class="py-2"><b>{alternade.toUpperCase()}</b> = <kbd class="kbd-sm">{getSubWord(alternade, 0)}</kbd> and <kbd class="kbd-sm">{getSubWord(alternade, 1)}</kbd></p>
      {/each}
    {/if}
  </div>
</dialog>
<dialog id="continue-modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg text-center">Welcome back!</h3>
    <p class="py-2 text-center"><b>Time: {($timer / 1000).toFixed(1)}</b></p>
    <p class="py-2 text-center"><b>Total guesses: {$totalGuesses}</b></p>
    <p class="py-2 text-center"><b>Incorrect guesses: {$incorrectGuesses}</b></p>
    <p class="py-2 text-center"><b>Remaining guesses: {$neededToWin - $correctGuesses}</b></p>

    <div class="flex flex-col items-center justify-center">
      <button on:click={continueGame} class="btn btn-md">Continue</button>
    </div>
  </div>
</dialog>
  </div>