class SoundManager {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('piggy_muted') === 'true';
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('piggy_muted', this.isMuted);
        return this.isMuted;
    }

    // High-pitched "ding" or "coin" sound
    playCoin() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(2000, t + 0.1);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.5);

        // Second slightly delayed "clink"
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1800, t + 0.05);
        gain2.gain.setValueAtTime(0.05, t + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(t + 0.05);
        osc2.stop(t + 0.3);
    }

    // Major chord arpeggio for achievement/milestone
    playSuccess() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.frequency.value = freq;
            osc.type = 'triangle';

            const start = t + (i * 0.1);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.1, start + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.6);
        });
    }

    // Fanfare for big milestones
    playMilestone() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        // Simple fanfare sequence
        const notes = [
            { f: 523.25, d: 0.1, w: 0 },   // C
            { f: 523.25, d: 0.1, w: 0.15 }, // C
            { f: 523.25, d: 0.1, w: 0.3 }, // C
            { f: 659.25, d: 0.4, w: 0.45 }, // E (Long)
            { f: 783.99, d: 0.4, w: 0.9 },  // G (Long)
            { f: 1046.50, d: 0.8, w: 1.4 }  // C (Very Long)
        ];

        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square'; // Gamier sound
            osc.frequency.value = n.f;

            const start = t + n.w;
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(0.05, start + 0.05); // Lower volume for square
            gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(start);
            osc.stop(start + n.d + 0.1);
        });
    }

    playClick() {
        if (this.isMuted) return;
        this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
    }
}

export const soundManager = new SoundManager();
