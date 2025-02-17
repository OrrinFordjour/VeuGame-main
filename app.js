// Functie om een willekeurige waarde te genereren binnen een bereik
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Vue app aanmaken
const app = Vue.createApp({
  // Gegevens voor de speler en het monster
  data() {
    return {
      playerHealth: 100, // Gezondheid van de speler
      monsterHealth: 100, // Gezondheid van het monster
      currentRound: 0, // Huidige ronde van het spel
      winner: null, // Resultaat van het spel (Speler, Monster, Draw)
      logMessages: [], // Log van de acties tijdens het spel
    };
  },
  computed: {
    // Berekening van de gezondheidsbalk voor het monster
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: "0%" }; // Als de gezondheid van het monster < 0 is, toon 0%
      }
      return { width: this.monsterHealth + "%" }; // Anders toon de actuele gezondheid
    },
    // Berekening van de gezondheidsbalk voor de speler
    playerBarStyle() {
      if (this.playerHealth < 0) {
        return { width: "0%" }; // Als de gezondheid van de speler < 0 is, toon 0%
      }
      return { width: this.playerHealth + "%" }; // Anders toon de actuele gezondheid
    },
    // Controleer of de speciale aanval beschikbaar is
    useSpecialAttack() {
      return this.currentRound % 3 !== 0; // Speciale aanval kan alleen elke derde ronde worden gebruikt
    },
  },
  watch: {
    // Kijk naar veranderingen in de gezondheid van de speler
    playerHealth(value) {
      // Als beide de speler en het monster dood zijn, is het gelijkspel
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "Monster"; // Als de speler dood is, wint het monster
      } else {
        // Niets doen als de speler nog leeft
      }
    },
    // Kijk naar veranderingen in de gezondheid van het monster
    monsterHealth(value) {
      // Als beide de speler en het monster dood zijn, is het gelijkspel
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "Player"; // Als het monster dood is, wint de speler
      }
    },
  },
  methods: {
    // Start een nieuw spel
    startGame() {
      this.playerHealth = 100; // Zet de gezondheid van de speler terug naar 100
      this.monsterHealth = 100; // Zet de gezondheid van het monster terug naar 100
      this.currentRound = 0; // Zet de ronde teller terug naar 0
      this.winner = null; // Reset de winnaar naar null
      this.logMessages = []; // Maak de log leeg
    },

    // Speler valt het monster aan
    attackMonster() {
      this.currentRound++; // Verhoog het ronde nummer
      const attackValue = getRandomValue(5, 12); // Willekeurige aanvalsterkte
      this.monsterHealth -= attackValue; // Verminder de gezondheid van het monster
      this.addLogMessage("Player", "Attacks", attackValue); // Voeg de actie toe aan het log
      this.attackPlayer(); // Het monster valt de speler aan na de actie van de speler
    },

    // Monster valt de speler aan
    attackPlayer() {
      const attackValue = getRandomValue(8, 15); // Willekeurige aanvalsterkte
      this.playerHealth -= attackValue; // Verminder de gezondheid van de speler
      this.addLogMessage("Monster", "Attacks", attackValue); // Voeg de actie toe aan het log
    },

    // Speciale aanval van de speler
    specialAttack() {
      this.currentRound++; // Verhoog het ronde nummer
      const attackValue = getRandomValue(10, 25); // Willekeurige aanvalsterkte voor speciale aanval
      this.monsterHealth -= attackValue; // Verminder de gezondheid van het monster
      this.addLogMessage("Player", "Attacks", attackValue); // Voeg de actie toe aan het log
      this.attackPlayer(); // Het monster valt de speler aan na de speciale aanval
    },

    // Speler geneest zichzelf
    healPlayer() {
      this.currentRound++; // Verhoog het ronde nummer
      const healthValue = getRandomValue(8, 20); // Willekeurige genezing
      // Zorg ervoor dat de gezondheid van de speler niet boven 100 komt
      if (this.playerHealth + healthValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healthValue;
      }
      this.addLogMessage("Player", "Heal", healthValue); // Voeg genezing toe aan het log
      this.attackPlayer(); // Het monster valt de speler aan na de genezing
    },

    // Speler geeft zich over
    surrender() {
      this.winner = "Monster"; // De speler heeft verloren door zich over te geven
    },

    // Voeg een bericht toe aan het log
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who, // Wie heeft de actie uitgevoerd (Player of Monster)
        actionType: what, // Wat voor actie werd uitgevoerd (Attack of Heal)
        actionValue: value, // De waarde van de actie (bijv. schade of genezing)
      });
    },
  },
});

// Vue app inladen en mounten op het element met id "game"
app.mount("#game");
