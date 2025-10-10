"use client";
import { useState, useEffect } from "react";

// 포커 핸드 랭킹 상수
export const HAND_RANKINGS = {
  HIGH_CARD: 1,
  PAIR: 2,
  TWO_PAIR: 3,
  THREE_OF_A_KIND: 4,
  STRAIGHT: 5,
  FLUSH: 6,
  FULL_HOUSE: 7,
  FOUR_OF_A_KIND: 8,
  STRAIGHT_FLUSH: 9,
  ROYAL_FLUSH: 10,
};

// 카드 덱 생성
export const createDeck = () => {
  const suits = ["hearts", "diamonds", "clubs", "spades"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  const symbols = ["♥", "♦", "♣", "♠"];

  const deck = [];
  suits.forEach((suit, suitIndex) => {
    ranks.forEach((rank, rankIndex) => {
      deck.push({
        suit,
        rank,
        symbol: symbols[suitIndex],
        value: rankIndex + 2, // 2=2, A=14
      });
    });
  });

  return deck;
};

// 덱 셔플
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 핸드 랭킹 계산
export const evaluateHand = (cards) => {
  if (cards.length < 5)
    return { ranking: HAND_RANKINGS.HIGH_CARD, cards: cards };

  const sortedCards = [...cards].sort((a, b) => b.value - a.value);
  const suits = sortedCards.map((card) => card.suit);
  const values = sortedCards.map((card) => card.value);

  // 같은 값의 카드 개수 계산
  const valueCounts = {};
  values.forEach((value) => {
    valueCounts[value] = (valueCounts[value] || 0) + 1;
  });

  const counts = Object.values(valueCounts).sort((a, b) => b - a);
  const isFlush = suits.every((suit) => suit === suits[0]);
  const isStraight = checkStraight(values);

  // 로얄 플러시 체크
  if (isFlush && isStraight && values[0] === 14) {
    return { ranking: HAND_RANKINGS.ROYAL_FLUSH, cards: sortedCards };
  }

  // 스트레이트 플러시
  if (isFlush && isStraight) {
    return { ranking: HAND_RANKINGS.STRAIGHT_FLUSH, cards: sortedCards };
  }

  // 포카드
  if (counts[0] === 4) {
    return { ranking: HAND_RANKINGS.FOUR_OF_A_KIND, cards: sortedCards };
  }

  // 풀하우스
  if (counts[0] === 3 && counts[1] === 2) {
    return { ranking: HAND_RANKINGS.FULL_HOUSE, cards: sortedCards };
  }

  // 플러시
  if (isFlush) {
    return { ranking: HAND_RANKINGS.FLUSH, cards: sortedCards };
  }

  // 스트레이트
  if (isStraight) {
    return { ranking: HAND_RANKINGS.STRAIGHT, cards: sortedCards };
  }

  // 트리플
  if (counts[0] === 3) {
    return { ranking: HAND_RANKINGS.THREE_OF_A_KIND, cards: sortedCards };
  }

  // 투페어
  if (counts[0] === 2 && counts[1] === 2) {
    return { ranking: HAND_RANKINGS.TWO_PAIR, cards: sortedCards };
  }

  // 원페어
  if (counts[0] === 2) {
    return { ranking: HAND_RANKINGS.PAIR, cards: sortedCards };
  }

  // 하이카드
  return { ranking: HAND_RANKINGS.HIGH_CARD, cards: sortedCards };
};

// 스트레이트 체크
const checkStraight = (values) => {
  const uniqueValues = [...new Set(values)].sort((a, b) => b - a);
  if (uniqueValues.length < 5) return false;

  for (let i = 0; i <= uniqueValues.length - 5; i++) {
    let consecutive = true;
    for (let j = 1; j < 5; j++) {
      if (uniqueValues[i] - uniqueValues[i + j] !== j) {
        consecutive = false;
        break;
      }
    }
    if (consecutive) return true;
  }

  // A-2-3-4-5 스트레이트 체크
  if (
    uniqueValues.includes(14) &&
    uniqueValues.includes(5) &&
    uniqueValues.includes(4) &&
    uniqueValues.includes(3) &&
    uniqueValues.includes(2)
  ) {
    return true;
  }

  return false;
};

// 핸드 랭킹 이름
export const getHandRankingName = (ranking) => {
  const names = {
    [HAND_RANKINGS.HIGH_CARD]: "High Card",
    [HAND_RANKINGS.PAIR]: "Pair",
    [HAND_RANKINGS.TWO_PAIR]: "Two Pair",
    [HAND_RANKINGS.THREE_OF_A_KIND]: "Three of a Kind",
    [HAND_RANKINGS.STRAIGHT]: "Straight",
    [HAND_RANKINGS.FLUSH]: "Flush",
    [HAND_RANKINGS.FULL_HOUSE]: "Full House",
    [HAND_RANKINGS.FOUR_OF_A_KIND]: "Four of a Kind",
    [HAND_RANKINGS.STRAIGHT_FLUSH]: "Straight Flush",
    [HAND_RANKINGS.ROYAL_FLUSH]: "Royal Flush",
  };
  return names[ranking] || "Unknown";
};

// 포커게임 메인 컴포넌트
export default function PokerGameLogic({ onGameUpdate, onChatMessage }) {
  const [gameState, setGameState] = useState("waiting"); // waiting, preflop, flop, turn, river, showdown, finished
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [playerChips, setPlayerChips] = useState(1000);
  const [aiChips, setAiChips] = useState(1000);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [playerBet, setPlayerBet] = useState(0);
  const [aiBet, setAiBet] = useState(0);
  const [dealerPosition, setDealerPosition] = useState("player"); // player or ai
  const [gamePhase, setGamePhase] = useState("preflop");

  // 게임 초기화
  const initializeGame = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setPlayerCards([]);
    setAiCards([]);
    setCommunityCards([]);
    setPot(0);
    setCurrentBet(0);
    setPlayerBet(0);
    setAiBet(0);
    setGameState("preflop");
    setGamePhase("preflop");

    // 블라인드 설정 (작은 블라인드 10, 빅 블라인드 20)
    const smallBlind = 10;
    const bigBlind = 20;

    if (dealerPosition === "player") {
      setPlayerChips((prev) => prev - smallBlind);
      setAiChips((prev) => prev - bigBlind);
      setPlayerBet(smallBlind);
      setAiBet(bigBlind);
      setCurrentBet(bigBlind);
    } else {
      setPlayerChips((prev) => prev - bigBlind);
      setAiChips((prev) => prev - smallBlind);
      setPlayerBet(bigBlind);
      setAiBet(smallBlind);
      setCurrentBet(bigBlind);
    }

    setPot(smallBlind + bigBlind);

    // 카드 딜링
    dealCards(newDeck);

    onChatMessage("ai", "New game started! Good luck!");
  };

  // 카드 딜링
  const dealCards = (deckToUse) => {
    const newDeck = [...deckToUse];
    const newPlayerCards = [newDeck.pop(), newDeck.pop()];
    const newAiCards = [newDeck.pop(), newDeck.pop()];

    setPlayerCards(newPlayerCards);
    setAiCards(newAiCards);
    setDeck(newDeck);
  };

  // 플레이어 액션 처리
  const handlePlayerAction = (action, amount = 0) => {
    if (gameState === "waiting" || gameState === "finished") return;

    switch (action) {
      case "fold":
        handleFold();
        break;
      case "call":
        handleCall();
        break;
      case "raise":
        handleRaise(amount);
        break;
      case "check":
        handleCheck();
        break;
    }
  };

  // 포기
  const handleFold = () => {
    setGameState("finished");
    setAiChips((prev) => prev + pot);
    onChatMessage("ai", "You folded. I win this hand!");
    onGameUpdate({
      gameState: "finished",
      winner: "ai",
      pot: pot,
      playerChips,
      aiChips: aiChips + pot,
    });
  };

  // 콜
  const handleCall = () => {
    const callAmount = currentBet - playerBet;
    if (callAmount > playerChips) {
      onChatMessage("ai", "You don't have enough chips to call!");
      return;
    }

    setPlayerChips((prev) => prev - callAmount);
    setPlayerBet((prev) => prev + callAmount);
    setPot((prev) => prev + callAmount);

    onChatMessage("player", `Call! Betting ${callAmount} chips.`);

    // AI 액션 처리
    setTimeout(() => {
      handleAIAction();
    }, 1000);
  };

  // 레이즈
  const handleRaise = (amount) => {
    const totalAmount = currentBet - playerBet + amount;
    if (totalAmount > playerChips) {
      onChatMessage("ai", "You don't have enough chips to raise!");
      return;
    }

    setPlayerChips((prev) => prev - totalAmount);
    setPlayerBet((prev) => prev + totalAmount);
    setCurrentBet((prev) => prev + amount);
    setPot((prev) => prev + totalAmount);

    onChatMessage("player", `Raise! Betting ${totalAmount} chips.`);

    // AI 액션 처리
    setTimeout(() => {
      handleAIAction();
    }, 1000);
  };

  // 체크
  const handleCheck = () => {
    if (playerBet !== currentBet) {
      onChatMessage("ai", "You can't check when there's a bet to call!");
      return;
    }

    onChatMessage("player", "Check.");

    // AI 액션 처리
    setTimeout(() => {
      handleAIAction();
    }, 1000);
  };

  // AI 액션 처리
  const handleAIAction = () => {
    const aiHand = evaluateHand([...aiCards, ...communityCards]);
    const playerHand = evaluateHand([...playerCards, ...communityCards]);

    // 간단한 AI 로직
    let aiAction = "call";

    if (aiHand.ranking >= HAND_RANKINGS.THREE_OF_A_KIND) {
      // 강한 핸드 - 레이즈
      const raiseAmount = Math.min(50, aiChips);
      if (raiseAmount > 0) {
        aiAction = "raise";
        setAiChips((prev) => prev - raiseAmount);
        setAiBet((prev) => prev + raiseAmount);
        setCurrentBet((prev) => prev + raiseAmount);
        setPot((prev) => prev + raiseAmount);
        onChatMessage("ai", `Raise! Betting ${raiseAmount} chips.`);
      }
    } else if (
      aiHand.ranking >= HAND_RANKINGS.PAIR &&
      currentBet - aiBet <= 20
    ) {
      // 중간 핸드 - 콜
      const callAmount = currentBet - aiBet;
      if (callAmount > 0 && callAmount <= aiChips) {
        setAiChips((prev) => prev - callAmount);
        setAiBet((prev) => prev + callAmount);
        setPot((prev) => prev + callAmount);
        onChatMessage("ai", `Call! Betting ${callAmount} chips.`);
      } else {
        onChatMessage("ai", "Check.");
      }
    } else {
      // 약한 핸드 - 포기
      aiAction = "fold";
      setGameState("finished");
      setPlayerChips((prev) => prev + pot);
      onChatMessage("ai", "I fold. You win this hand!");
      onGameUpdate({
        gameState: "finished",
        winner: "player",
        pot: pot,
        playerChips: playerChips + pot,
        aiChips,
      });
      return;
    }

    // 다음 단계로 진행
    if (aiAction !== "fold") {
      proceedToNextPhase();
    }
  };

  // 다음 단계로 진행
  const proceedToNextPhase = () => {
    if (playerBet === aiBet && playerBet > 0) {
      // 베팅이 맞춰졌으므로 다음 단계로
      switch (gamePhase) {
        case "preflop":
          dealFlop();
          break;
        case "flop":
          dealTurn();
          break;
        case "turn":
          dealRiver();
          break;
        case "river":
          showDown();
          break;
      }
    }
  };

  // 플롭 딜링
  const dealFlop = () => {
    const newDeck = [...deck];
    const flopCards = [newDeck.pop(), newDeck.pop(), newDeck.pop()];
    setCommunityCards(flopCards);
    setDeck(newDeck);
    setGamePhase("flop");
    setPlayerBet(0);
    setAiBet(0);
    setCurrentBet(0);
    onChatMessage("ai", "Flop dealt!");
  };

  // 턴 딜링
  const dealTurn = () => {
    const newDeck = [...deck];
    const turnCard = newDeck.pop();
    setCommunityCards((prev) => [...prev, turnCard]);
    setDeck(newDeck);
    setGamePhase("turn");
    setPlayerBet(0);
    setAiBet(0);
    setCurrentBet(0);
    onChatMessage("ai", "Turn dealt!");
  };

  // 리버 딜링
  const dealRiver = () => {
    const newDeck = [...deck];
    const riverCard = newDeck.pop();
    setCommunityCards((prev) => [...prev, riverCard]);
    setDeck(newDeck);
    setGamePhase("river");
    setPlayerBet(0);
    setAiBet(0);
    setCurrentBet(0);
    onChatMessage("ai", "River dealt!");
  };

  // 쇼다운
  const showDown = () => {
    const playerHand = evaluateHand([...playerCards, ...communityCards]);
    const aiHand = evaluateHand([...aiCards, ...communityCards]);

    let winner = "tie";
    if (playerHand.ranking > aiHand.ranking) {
      winner = "player";
    } else if (aiHand.ranking > playerHand.ranking) {
      winner = "ai";
    }

    setGameState("finished");

    if (winner === "player") {
      setPlayerChips((prev) => prev + pot);
      onChatMessage(
        "ai",
        `You win! ${getHandRankingName(
          playerHand.ranking
        )} beats ${getHandRankingName(aiHand.ranking)}`
      );
    } else if (winner === "ai") {
      setAiChips((prev) => prev + pot);
      onChatMessage(
        "ai",
        `I win! ${getHandRankingName(
          aiHand.ranking
        )} beats ${getHandRankingName(playerHand.ranking)}`
      );
    } else {
      // 타이 - 팟 분할
      setPlayerChips((prev) => prev + Math.floor(pot / 2));
      setAiChips((prev) => prev + Math.floor(pot / 2));
      onChatMessage("ai", "It's a tie! Pot is split.");
    }

    onGameUpdate({
      gameState: "finished",
      winner,
      pot: 0,
      playerChips: winner === "player" ? playerChips + pot : playerChips,
      aiChips: winner === "ai" ? aiChips + pot : aiChips,
      playerHand: getHandRankingName(playerHand.ranking),
      aiHand: getHandRankingName(aiHand.ranking),
    });
  };

  // 게임 시작
  const startGame = () => {
    initializeGame();
  };

  // 새 게임
  const newGame = () => {
    setDealerPosition((prev) => (prev === "player" ? "ai" : "player"));
    initializeGame();
  };

  return {
    gameState,
    playerCards,
    aiCards,
    communityCards,
    playerChips,
    aiChips,
    pot,
    currentBet,
    playerBet,
    aiBet,
    gamePhase,
    startGame,
    newGame,
    handlePlayerAction,
  };
}
