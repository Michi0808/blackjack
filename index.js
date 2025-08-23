const suit = ["c", "d", "h", "s"];
const cardNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let deck = [];
let dStopFlg = true;
let bustFlg = false;
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

    // Count aces afterwords using a special logic
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
  if (score > 21) bustFlg = true;

  $(".dealerscore").text(score);

  // If the score is 22 or higher, declare Bust and end the game
  if (bustFlg) {
    $(".dealerstatus").append(
      `<img src="./image/bust.png" alt="bust" width="150" height="60">`
    );
    showOutcome("win");
  }

  // If the first two cards equal 21, declare Blackjack and end the game
  if (dBjFlg && score === 21) {
    $(".dealerstatus").append(
      `<img src="./image/bj.png" alt="bust" width="150" height="60">`
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

    // Count aces afterwords using a special logic
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

  if (score > 21) bustFlg = true;

  $(".playerscore").text(score);

  // If the score is 22 or higher, declare Bust and end the game
  if (bustFlg) {
    $(".playerstatus").append(
      `<img src="./image/bust.png" alt="bust" width="150" height="60">`
    );
    showOutcome("lose");
  }

  // If the first two cards equal 21, declare Blackjack and end the game
  if (pBjFlg && score === 21) {
    $(".playerstatus").append(
      `<img src="./image/bj.png" alt="bust" width="150" height="60">`
    );
    showOutcome("win");
    pBjFlg = false;
  }
});

//Each player draws 2 cards for an opening setting
generatDeck();
opening(deck);

// ===================================================================================================
// Deck generation, Ref: https://mebee.info/2022/08/24/post-71799/
// ===================================================================================================
function generatDeck() {
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
function opening(deck) {
  // Player draws two face-up cards at the beginning
  for (let i = 0; i < 2; i++) {
    const card = drawCard(deck);
    displayCard("playercards", card);
  }
  //Score calculation
  $(".playercards").trigger("cardAdded");

  // Dealer draws one face-up card and one face-down card at the beginning
  const dealerCard = drawCard(deck);
  $(".dealercards").append(
    `<img src="./image/cards/${dealerCard.num}_${dealerCard.suit}.png" alt="cards" width="130" height="189">`
  );
  $(".dealercards").prepend(
    `<img src="./image/cards/0_back.png" alt="cards" width="130" height="189" class="back">`
  );
  //Score calculation
  $(".dealercards").trigger("cardAdded");
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
function displayCard(targetClass, card) {
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
}

// ===================================================================================================
//Display the outcome of the game
// ===================================================================================================
function showOutcome(outcome) {
  $(".outcome").prepend(
    `<img src="./image/${outcome}.png" alt="cards" width="500" height="300" id="result">`
  );
  $(".popup").addClass("show-popup").fadeIn();
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
  bustFlg = false;
  pBjFlg = true;
  dBjFlg = true;
  generatDeck();
  opening(deck);
}

// ===================================================================================================
// Hit button
// ===================================================================================================
$("#hit-button").click(function () {
  pBjFlg = false;
  const card = drawCard(deck);
  displayCard("playercards", card);
});

// ===================================================================================================
// Stand button
// ===================================================================================================
$("#stand-button").click(function () {
  $("#hit-button").prop("disabled", true);
  $(".back").remove();

  const card = drawCard(deck);
  displayCard("dealercards", card);

  // If Blackjack, skip further processing
  let dScore = Number($(".dealerscore").text());
  if (dScore === 21) return;

  dBjFlg = false;

  // Dealer must hit until reaching at least 17
  while (dStopFlg) {
    const card = drawCard(deck);
    displayCard("dealercards", card);
  }

  // If Bust, skip further processing
  if (bustFlg) return;

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
