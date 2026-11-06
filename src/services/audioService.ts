/**
 * Web Audio API procedural synthesizer for Afro-Brazilian musical instruments
 * Features Berimbau, Atabaque, Agogô, Cabaça/Chocalho, and rhythm loop generator.
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private volume: number = 0.8;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled && this.bgmEnabled) {
      this.stopAfroBeat();
    }
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (enabled) {
      this.startAfroBeat();
    } else {
      this.stopAfroBeat();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public getBgmEnabled(): boolean {
    return this.bgmEnabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Synthesize authentic Berimbau sound:
   * Steel wire twang (arame) with coin/dobrão press frequency modulation + resonant gourd (cabaça) filter.
   */
  public playBerimbau(pitch: 'grave' | 'medio' | 'agudo' = 'medio', open: boolean = true) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const baseFreq = pitch === 'grave' ? 146.8 : pitch === 'medio' ? 174.6 : 220.0;
      const freq = open ? baseFreq : baseFreq * 1.12; // pressed with pedra/dobrão

      // Wire fundamental
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 0.3);

      // Cabaça acoustic resonance filter
      const cabacaFilter = this.ctx.createBiquadFilter();
      cabacaFilter.type = 'bandpass';
      cabacaFilter.frequency.setValueAtTime(open ? freq * 2.2 : freq * 2.8, now);
      cabacaFilter.Q.setValueAtTime(8, now);

      // Amplitude envelope
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35 * this.volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (open ? 0.65 : 0.35));

      osc.connect(cabacaFilter);
      cabacaFilter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.7);

      // Subtle buzz transient (chiado do berimbau)
      this.playCaxixiTransient(now);
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Caxixi rattle transient paired with berimbau strike
   */
  private playCaxixiTransient(now: number) {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  /**
   * Synthesize Atabaque (Afro-Brazilian drum) sound
   * Low resonant skin strike with warm pitch decay.
   */
  public playAtabaque(intensity: 'grave' | 'forte' | 'leve' = 'grave') {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';

      const startFreq = intensity === 'grave' ? 120 : intensity === 'forte' ? 150 : 180;
      const endFreq = intensity === 'grave' ? 45 : intensity === 'forte' ? 65 : 80;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.22);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.5 * this.volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Synthesize Agogô (dual metallic bell)
   */
  public playAgogo(high: boolean = false) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const freq = high ? 880 : 587.33; // D5 vs A5

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 1.58, now); // metallic inharmonic ratio

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.22 * this.volume, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Golden cowrie shell (Búzio) collection chime
   */
  public playBuzioChime() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.18 * this.volume, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch {
      // silent fallback
    }
  }

  /**
   * Correct answer celebratory sound
   */
  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Major chord arpeggio: C5, E5, G5, C6
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const time = now + i * 0.07;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.25 * this.volume, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.4);
      });
    } catch {
      // fallback
    }
  }

  /**
   * Wrong answer or hazard soft thud
   */
  public playWrong() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.25);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // fallback
    }
  }

  /**
   * Dialogue typing blip
   */
  public playDialogueBlip() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.03 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // fallback
    }
  }

  /**
   * Victory / Phase Complete Fanfare
   */
  public playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Fanfare notes
      const notes = [
        { f: 440, t: 0, d: 0.15 },
        { f: 554.37, t: 0.15, d: 0.15 },
        { f: 659.25, t: 0.3, d: 0.2 },
        { f: 880, t: 0.5, d: 0.5 },
      ];
      notes.forEach((n) => {
        if (!this.ctx) return;
        const time = now + n.t;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.3 * this.volume, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + n.d + 0.05);
      });
    } catch {
      // fallback
    }
  }

  /**
   * Procedural Afro-Brazilian Percussion Beat Loop (Ijexá / Capoeira São Bento rhythm)
   * Plays a live groove without any external MP3 files!
   */
  public startAfroBeat() {
    if (this.bgmIntervalId !== null) return;
    this.bgmEnabled = true;
    this.bgmStep = 0;

    // Tempo: ~105 BPM -> 16th note ~ 142ms
    const stepMs = 145;

    this.bgmIntervalId = window.setInterval(() => {
      if (!this.soundEnabled || !this.bgmEnabled) return;
      const step = this.bgmStep % 16;
      this.bgmStep++;

      // Pattern:
      // Atabaque on 0, 4, 8, 10, 14
      if (step === 0 || step === 8) {
        this.playAtabaque('grave');
      } else if (step === 4 || step === 12) {
        this.playAtabaque('forte');
      } else if (step === 10 || step === 14) {
        this.playAtabaque('leve');
      }

      // Agogo bell rhythm (traditional Ijexá toque)
      // High bell on 0, 3, 6, 8, 11, 12, 14
      if (step === 0 || step === 6 || step === 11) {
        this.playAgogo(true);
      } else if (step === 3 || step === 8 || step === 14) {
        this.playAgogo(false);
      }

      // Berimbau touches every 4 steps
      if (step === 0) {
        this.playBerimbau('grave', true);
      } else if (step === 8) {
        this.playBerimbau('agudo', false);
      }
    }, stepMs);
  }

  public stopAfroBeat() {
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.bgmEnabled = false;
  }
}

export const audioService = new AudioService();
