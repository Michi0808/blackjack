const suit = ["c", "d", "h", "s"];
const cardNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const deck = [];
let dScore = 0;

// Deck generation, Ref: https://mebee.info/2022/08/24/post-71799/
for (let i = 0; i < suit.length; i++) {
  for (let j = 0; j < cardNum.length; j++) {
    let card = { num: cardNum[j], suit: suit[i] };
    deck.push(card);
  }
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
  $(`.${targetClass}`).append(
    `<img src="./image/cards/${card.num}_${card.suit}.png" alt="cards" width="130" height="189">`
  );
}
// Hit button
$("#hit-button").click(function () {
  const card = drawCard(deck);
  displayCard("playercards", card);
});

// Sum up the score
$(".dealercards img").each(function () {
  let src = $(this).attr("src");
  let filename = src.split("/").pop();
  let number = filename.split("_")[0];
  dScore += parseInt(number);
});

$(".dealerscore").text(isNaN(dScore) ? 0 : dScore);
