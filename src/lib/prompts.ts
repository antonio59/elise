export interface Prompt {
  text: string;
  category: string;
}

export const WRITING_PROMPTS: Prompt[] = [
  // Poetry
  { text: "Write about the color of silence", category: "poetry" },
  { text: "Describe a thunderstorm from the perspective of a houseplant", category: "poetry" },
  { text: "Write a poem using only questions", category: "poetry" },
  { text: "The last leaf on the tree has something to say", category: "poetry" },
  { text: "Write about a memory that feels like a song", category: "poetry" },
  { text: "What does nostalgia taste like?", category: "poetry" },
  { text: "Describe your favorite place using only smells", category: "poetry" },
  { text: "Write a love letter to the moon", category: "poetry" },
  { text: "The shadow on your wall comes alive at midnight", category: "poetry" },
  { text: "What would your anxiety say if it could speak?", category: "poetry" },
  // Stories
  { text: "Your character finds a door in their basement that wasn't there yesterday", category: "story" },
  { text: "Write a story that takes place entirely inside a refrigerator", category: "story" },
  { text: "A pen that writes the future — but only lies", category: "story" },
  { text: "Your pet has been secretly running a business while you're at school", category: "story" },
  { text: "The library at midnight: the books rearrange themselves into messages", category: "story" },
  { text: "A world where emotions are currency", category: "story" },
  { text: "You wake up with the ability to hear colors", category: "story" },
  { text: "The old photo album in the attic shows pictures of your future", category: "story" },
  { text: "Write a story backwards — start with the ending", category: "story" },
  { text: "Two strangers keep having the same dream about each other", category: "story" },
  // Journal
  { text: "What would you tell yourself exactly one year ago?", category: "journal" },
  { text: "Describe your perfect day in exhausting detail", category: "journal" },
  { text: "What are you proud of that you never tell anyone?", category: "journal" },
  { text: "If your life had a soundtrack, what are the top 5 songs right now?", category: "journal" },
  { text: "Write about a time you changed your mind about something important", category: "journal" },
  { text: "What does 'home' mean to you?", category: "journal" },
  { text: "Describe yourself as a character in a book — be honest", category: "journal" },
  { text: "What's something you're looking forward to? What's something you're dreading?", category: "journal" },
  { text: "Write a letter to someone you'll never send it to", category: "journal" },
  { text: "What did you learn about yourself this week?", category: "journal" },
];

export const ART_PROMPTS: Prompt[] = [
  { text: "Draw your favorite book character as a cat", category: "art" },
  { text: "Redesign the cover of the last book you read", category: "art" },
  { text: "Draw a self-portrait as your favorite fictional character", category: "art" },
  { text: "Illustrate a scene from a dream you remember", category: "art" },
  { text: "Draw your mood today as a weather forecast", category: "art" },
  { text: "Create a map of an imaginary place you'd like to visit", category: "art" },
  { text: "Draw your favorite song — what does it look like?", category: "art" },
  { text: "Design a tattoo you'd never actually get", category: "art" },
  { text: "Draw your room from a bird's eye view", category: "art" },
  { text: "Illustrate a monster that represents your fear — then make it cute", category: "art" },
  { text: "Draw a food that doesn't exist but should", category: "art" },
  { text: "Create a propaganda poster for something silly", category: "art" },
  { text: "Draw your favorite place at 3 AM vs 3 PM", category: "art" },
  { text: "Design a logo for your own personal brand", category: "art" },
  { text: "Draw a house where each room is a different emotion", category: "art" },
];

export function getRandomPrompt(type: "poetry" | "story" | "journal" | "art"): Prompt {
  const pool = type === "art" ? ART_PROMPTS : WRITING_PROMPTS.filter((p) => p.category === type);
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDailyPrompt(): { writing: Prompt; art: Prompt } {
  const seed = new Date().toISOString().split("T")[0];
  const hash = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const writingPool = WRITING_PROMPTS;
  const artPool = ART_PROMPTS;
  return {
    writing: writingPool[hash % writingPool.length],
    art: artPool[hash % artPool.length],
  };
}
