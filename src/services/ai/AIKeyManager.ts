export class AIKeyManager {
  private keys: string[];
  private currentIndex: number = 0;

  constructor() {
    // Support multiple keys separated by commas for rotation
    const keysEnv = process.env.API_KEY || process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
    this.keys = keysEnv.split(',').map(k => k.trim()).filter(k => k.length > 0 && k !== "MY_GEMINI_API_KEY");
    
    if (this.keys.length === 0) {
      console.warn("No GEMINI_API_KEYS found. AI features will be disabled.");
    }
  }

  getNextKey(): string | null {
    if (this.keys.length === 0) return null;
    const key = this.keys[this.currentIndex];
    // Round-robin rotation
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return key;
  }

  hasKeys(): boolean {
    return this.keys.length > 0;
  }
}
