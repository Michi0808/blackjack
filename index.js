const suit = ["c", "d", "h", "s"];
const cardNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const deck = [];

// Custom event listener : when a new card is added to dealer's hand, sum up the score
$(".dealercards").on("cardAdded", function () {
  let score = 0;
  let aceCount = 0;

  $(".dealercards img").each(function () {
    let src = $(this).attr("src");
    let filename = src.split("/").pop();
    let number = filename.split("_")[0];

    //Logic for the face cards (J, Q, K), they all value 10
    if (["11", "12", "13"].includes(number)) {
      number = "10";
    }

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

  $(".dealerscore").text(score);
});

// Custom event listener : when a new card is added to player's hand, sum up the score
$(".playercards").on("cardAdded", function () {
  let score = 0;
  let aceCount = 0;

  $(".playercards img").each(function () {
    let src = $(this).attr("src");
    let filename = src.split("/").pop();
    let number = filename.split("_")[0];

    //Logic for the face cards (J, Q, K), they all value 10
    if (["11", "12", "13"].includes(number)) {
      number = "10";
    }

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

  $(".playerscore").text(score);
});

// Deck generation, Ref: https://mebee.info/2022/08/24/post-71799/
for (let i = 0; i < suit.length; i++) {
  for (let j = 0; j < cardNum.length; j++) {
    let card = { num: cardNum[j], suit: suit[i] };
    deck.push(card);
  }
}

//Each player draws 2 cards for an opening setting
opening(deck);

// Setting first hands
function opening(deck) {
  for (let i = 0; i < 2; i++) {
    const card = drawCard(deck);
    displayCard("playercards", card);
  }
  //Score calculation
  $(".playercards").trigger("cardAdded");

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

// Drawing a card
function drawCard(deck) {
  let index = Math.floor(Math.random() * deck.length);
  let card = deck[index];
  deck.splice(index, 1);
  return card;
}

// Display a new card
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

// Hit button
$("#hit-button").click(function () {
  const card = drawCard(deck);
  displayCard("playercards", card);
});

// Strand button
$("#stand-button").click(function () {
  $(".back").remove();
  const card = drawCard(deck);
  displayCard("dealercards", card);
});
