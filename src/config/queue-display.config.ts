// ─── Queue Display Configuration ───
// Controls how queue numbers are formatted and displayed across the application

export interface QueueDisplayConfig {
  /** Prefix character(s) to prepend to queue numbers (e.g. "A", "Q", "B") */
  prefix: string;
  /** Whether to show the prefix before queue numbers */
  prefixEnabled: boolean;
  /** Minimum number of digits to pad the queue number to (e.g. 3 → "001") */
  padLength: number;
  /** Character to pad queue numbers with */
  padCharacter: string;
}

// ─── Default Configuration ───
export const QUEUE_DISPLAY_CONFIG: QueueDisplayConfig = {
  prefix: 'A',
  prefixEnabled: true,
  padLength: 3,
  padCharacter: '0',
};

/**
 * Format a queue number for display according to the config.
 *
 * Examples (with default config):
 *   formatQueueNumber(1)   → "A001"
 *   formatQueueNumber(42)  → "A042"
 *   formatQueueNumber(100) → "A100"
 *
 * With prefixEnabled: false:
 *   formatQueueNumber(1)   → "001"
 *   formatQueueNumber(42)  → "042"
 */
export function formatQueueNumber(
  queueNumber: number,
  config: QueueDisplayConfig = QUEUE_DISPLAY_CONFIG
): string {
  const paddedNumber = queueNumber.toString().padStart(config.padLength, config.padCharacter);
  return config.prefixEnabled ? `${config.prefix}${paddedNumber}` : paddedNumber;
}
