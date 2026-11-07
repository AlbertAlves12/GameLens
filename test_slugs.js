const slugs = {
  "Cyberpunk 2077": "cyberpunk-2077",
  "Cyberpunk 2077: Ultimate Edition": "cyberpunk-2077",
  "Elden Ring": "elden-ring",
  "Elden Ring Shadow of the Erdtree": "elden-ring-shadow-of-the-erdtree",
  "Baldur's Gate 3": "baldurs-gate-3",
  "The Witcher 3: Wild Hunt": "the-witcher-3-wild-hunt",
  "The Witcher 3: Wild Hunt - Complete Edition": "the-witcher-3-wild-hunt",
  "Resident Evil 4": "resident-evil-4",
  "Resident Evil 4 Remake": "resident-evil-4",
  "Grand Theft Auto V": "grand-theft-auto-v-premium-edition",
  "Grand Theft Auto V: Premium Edition": "grand-theft-auto-v-premium-edition",
  "Grand Theft Auto IV": "grand-theft-auto-iv-the-complete-edition",
  "Grand Theft Auto IV: The Complete Edition": "grand-theft-auto-iv-the-complete-edition",
  "God of War": "god-of-war",
  "Helldivers 2": "helldivers-2",
  "HELLDIVERS™ 2": "helldivers-2",
  "Hogwarts Legacy": "hogwarts-legacy",
  "Red Dead Redemption 2": "red-dead-redemption-ii",
  "Rise of the Tomb Raider": "rise-of-the-tomb-raider-20-year-celebration",
  "Rise of the Tomb Raider™": "rise-of-the-tomb-raider-20-year-celebration",
  "Shadow of the Tomb Raider": "shadow-of-the-tomb-raider-definitive-edition",
  "Shadow of the Tomb Raider: Definitive Edition": "shadow-of-the-tomb-raider-definitive-edition"
};

async function check() {
  for (const [name, slug] of Object.entries(slugs)) {
    try {
      const res = await fetch("https://www.nuuvem.com/br-pt/item/" + slug, { method: "HEAD" });
      console.log(`${res.status === 200 ? "OK 200" : "FAIL " + res.status}: [${name}] -> ${slug}`);
    } catch (e) {
      console.log(`ERROR: [${name}] -> ${e.message}`);
    }
  }
}
check();
