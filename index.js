const suit = ["c", "d", "h", "s"];
const cardNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
let deck = [];
let dStopFlg = true;
let pBust = false;
let dBust = false;
let gameOver = false;
let dBjFlg = true;
let pBjFlg = true;

// ===================================================================================================
// Dealer score event listener : when a new card is added to dealer's hand, sum up the score
// ===================================================================================================
$(".dealercards").on("cardAdded", function () {
  let score = 0;
  let aceCount = 0;

  // Extract the score part from the card filename
  $(".dealercards img").each(function () {
    let src = $(this).attr("src");
    let filename = src.split("/").pop();
    let number = filename.split("_")[0];

    //Logic for the face cards (J, Q, K), they all value 10
    if (["11", "12", "13"].includes(number)) {
      number = "10";
    }

    // Count aces afterwards using a special logic
    if (number === "1") {
      aceCount++;
    } else {
      score += parseInt(number);
    }
  });

  //Logic for the ace card, If the total score includes an ace itself over 21, Ace value 1, otherwise 11
  while (aceCount > 0) {
    score += 11;
    if (score > 21) score -= 10;
    aceCount--;
  }

  if (score > 16) dStopFlg = false;
  if (score > 21) dBust = true;

  $(".dealerscore").text(score);

  // If the score is 22 or higher, declare Bust and end the game
  if (dBust) {
    $(".dealerstatus").append(
      `<img src="./image/bust.png" alt="bust" width="150" height="60">`
    );
    showOutcome("win");
  }

  // If the first two cards equal 21, declare Blackjack and end the game
  if (dBjFlg && score === 21) {
    $(".dealerstatus").append(
      `<img src="./image/bj.png" alt="blackjack" width="150" height="60">`
    );
    showOutcome("lose");
  }
});

// ===================================================================================================
// Player score event listener : when a new card is added to player's hand, sum up the score
// ===================================================================================================
$(".playercards").on("cardAdded", function () {
  let score = 0;
  let aceCount = 0;

  // Extract the score part from the card filename
  $(".playercards img").each(function () {
    let src = $(this).attr("src");
    let filename = src.split("/").pop();
    let number = filename.split("_")[0];

    //Logic for the face cards (J, Q, K), they all value 10
    if (["11", "12", "13"].includes(number)) {
      number = "10";
    }

    // Count aces afterwards using a special logic
    if (number === "1") {
      aceCount++;
    } else {
      score += parseInt(number);
    }
  });

  //Logic for the ace card, If the total score includes an ace itself over 21, Ace value 1, otherwise 11
  while (aceCount > 0) {
    score += 11;
    if (score > 21) score -= 10;
    aceCount--;
  }

  if (score > 21) pBust = true;

  $(".playerscore").text(score);

  // If the score is 22 or higher, declare Bust and end the game
  if (pBust) {
    $(".playerstatus").append(
      `<img src="./image/bust.png" alt="bust" width="150" height="60">`
    );
    showOutcome("lose");
  }

  // If the first two cards equal 21, declare Blackjack and end the game
  if (pBjFlg && score === 21) {
    $(".playerstatus").append(
      `<img src="./image/bj.png" alt="blackjack" width="150" height="60">`
    );
    showOutcome("win");
    pBjFlg = false;
  }
});

//Each player draws 2 cards for an opening setting
playSound($("#deal"));
generateDeck();
opening(deck);

// ===================================================================================================
// Deck generation
// ===================================================================================================
function generateDeck() {
  for (let i = 0; i < suit.length; i++) {
    for (let j = 0; j < cardNum.length; j++) {
      let card = { num: cardNum[j], suit: suit[i] };
      deck.push(card);
    }
  }
}

// ===================================================================================================
// Setting first hands
// ===================================================================================================
async function opening(deck) {
  // Player draws two face-up cards at the beginning
  const pCard1 = drawCard(deck);
  await displayCard("playercards", pCard1);

  const pCard2 = drawCard(deck);
  await displayCard("playercards", pCard2);

  //Score calculation
  $(".playercards").trigger("cardAdded");

  // Dealer draws one face-up card and one face-down card at the beginning
  const dCard1 = drawCard(deck);
  await displayCard("dealercards", dCard1);

  await displayFaceDown("dealercards");
  //Score calculation
  $(".dealercards").trigger("cardAdded");

  $("#hit-button").prop("disabled", false);
  $("#stand-button").prop("disabled", false);
}

// ===================================================================================================
// Drawing a card
// ===================================================================================================
function drawCard(deck) {
  // Select a random card from the deck
  let index = Math.floor(Math.random() * deck.length);
  let card = deck[index];
  deck.splice(index, 1);
  return card;
}

// ===================================================================================================
// Display a new card
// ===================================================================================================
function displayCard(targetClass, card, ms = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (targetClass === "playercards") {
        $(`.${targetClass}`).append(
          `<img src="./image/cards/${card.num}_${card.suit}.png" alt="cards" width="130" height="189">`
        );
      } else {
        $(`.${targetClass}`).prepend(
          `<img src="./image/cards/${card.num}_${card.suit}.png" alt="cards" width="130" height="189">`
        );
      }

      //Score calculation
      $(`.${targetClass}`).trigger("cardAdded");
      resolve();
    }, ms);
  });
}

// ===================================================================================================
// Drawing dealer's first face-down card
// ===================================================================================================
function displayFaceDown(targetClass, ms = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      $(`.${targetClass}`).prepend(
        `<img src="./image/cards/0_back.png" alt="card-back" width="130" height="189" class="back">`
      );
      resolve();
    }, ms);
  });
}

// ===================================================================================================
//Display the outcome of the game
// ===================================================================================================
function showOutcome(outcome) {
  if (gameOver) return;
  gameOver = true;

  $("#hit-button").prop("disabled", true);
  $("#stand-button").prop("disabled", true);

  $(".outcome").prepend(
    `<img src="./image/${outcome}.png" alt="outcome" width="500" height="300" id="result">`
  );
  $(".popup").addClass("show-popup").fadeIn();
}

// ===================================================================================================
//Play a short sound effect
// ===================================================================================================
function playSound($audio) {
  const el = $audio.get(0);
  if (!el) return;

  // Pause any current playback
  el.pause();
  // Reset the playback position
  el.currentTime = 0;
  el.play();
}

// ===================================================================================================
//Reset the game setting
// ===================================================================================================
function reset() {
  $(".dealercards").empty();
  $(".playercards").empty();
  $(".dealerstatus").empty();
  $(".playerstatus").empty();
  $("#result").remove();
  $("#hit-button").prop("disabled", false);
  deck = [];
  dStopFlg = true;
  gameOver = false;
  pBust = false;
  dBust = false;
  pBjFlg = true;
  dBjFlg = true;
  $("#hit-button").prop("disabled", true);
  $("#stand-button").prop("disabled", true);
  playSound($("#deal"));
  generateDeck();
  opening(deck);
}

// ===================================================================================================
// Hit button
// ===================================================================================================
$("#hit-button").click(function () {
  playSound($("#draw"));
  pBjFlg = false;
  const card = drawCard(deck);
  displayCard("playercards", card);
});

// ===================================================================================================
// Stand button
// ===================================================================================================
$("#stand-button").on("click", async () => {
  $("#hit-button").prop("disabled", true);
  $("#stand-button").prop("disabled", true);
  $(".back").remove();

  const card = drawCard(deck);
  await displayCard("dealercards", card, 300);

  // If Blackjack, skip further processing
  let dScore = Number($(".dealerscore").text());
  if (dScore === 21) return;

  dBjFlg = false;

  // Dealer must hit until reaching at least 17
  while (dStopFlg) {
    const card = drawCard(deck);
    playSound($("#draw"));
    await displayCard("dealercards", card, 500);
  }

  // If Bust, skip further processing
  if (dBust) return;

  //Determine the winner
  dScore = Number($(".dealerscore").text());
  let pScore = Number($(".playerscore").text());

  if (dScore > pScore) {
    showOutcome("lose");
  } else if (dScore < pScore) {
    showOutcome("win");
  } else {
    showOutcome("even");
  }
});

// ===================================================================================================
// OK button
// ===================================================================================================
$("#ok").on("click", function () {
  $(".popup").fadeOut();
  reset();
});
