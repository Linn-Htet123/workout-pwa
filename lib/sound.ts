// ---------------------------------------------------------------------------
// Tiny sound helper. We synthesize beeps with the Web Audio API — no sound
// files needed. This works on iPhone (where vibration does not), as long as
// the screen is on and the audio was "unlocked" by a tap first.
// ---------------------------------------------------------------------------

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

// Call this inside a tap handler so iOS allows sound to play later.
export function unlockAudio(): void {
  const c = getCtx();
  if (c && c.state === "suspended") c.resume().catch(() => {});
}

function tone(
  c: AudioContext,
  startAt: number,
  freq: number,
  dur: number,
  peak: number
): void {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.02);
}

export type AlarmKind = "rest" | "set" | "done";

export function playAlarm(kind: AlarmKind): void {
  const c = getCtx();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const t = c.currentTime;

  if (kind === "rest") {
    // Attention-grabbing triple beep — rest is over, get back to it.
    [0, 0.28, 0.56].forEach((o) => tone(c, t + o, 880, 0.22, 0.35));
  } else if (kind === "set") {
    // Short single beep — you stopped the set timer.
    tone(c, t, 660, 0.16, 0.28);
  } else {
    // Rising three notes — whole workout complete.
    ([[0, 660], [0.16, 880], [0.32, 1046]] as [number, number][]).forEach(
      ([o, f]) => tone(c, t + o, f, 0.2, 0.32)
    );
  }
}
