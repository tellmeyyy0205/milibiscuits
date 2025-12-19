/**
 * Generates a synthetic "crunch" sound using Web Audio API
 * This avoids external file dependencies and 404 errors.
 */
export const playCrunchSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise with a decay
    for (let i = 0; i < bufferSize; i++) {
      // Noise
      const noise = Math.random() * 2 - 1;
      // Envelope: Sharp attack, fast decay
      const envelope = Math.exp(-i / (ctx.sampleRate * 0.05));
      data[i] = noise * envelope;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Filter to make it sound more like a cookie crunch (Highpass)
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    // Gain to control volume
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};
