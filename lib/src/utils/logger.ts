/**
 * Log levels in order of severity
 */
export const LogLevel = {
  DEBUG: "debug",
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
  NONE: "none",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export class Logger {
  readonly #level: LogLevel;
  readonly #levelOrder = [
    LogLevel.DEBUG,
    LogLevel.INFO,
    LogLevel.WARN,
    LogLevel.ERROR,
    LogLevel.NONE,
  ] as const;

  constructor(level: LogLevel = LogLevel.WARN) {
    this.#level = level;
  }

  #shouldLog(messageLevel: LogLevel): boolean {
    if (this.#level === LogLevel.NONE) return false;

    return (
      this.#levelOrder.indexOf(messageLevel) >=
      this.#levelOrder.indexOf(this.#level)
    );
  }

  public debug(message: string, ...args: unknown[]): void {
    if (!this.#shouldLog(LogLevel.DEBUG)) return;

    // eslint-disable-next-line no-console
    console.debug(`[ReactDesignTokens] ${message}`, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    if (!this.#shouldLog(LogLevel.INFO)) return;

    // eslint-disable-next-line no-console
    console.info(`[ReactDesignTokens] ${message}`, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    if (!this.#shouldLog(LogLevel.WARN)) return;

    // eslint-disable-next-line no-console
    console.warn(`[ReactDesignTokens] ${message}`, ...args);
  }

  public error(message: string, ...args: unknown[]): void {
    if (!this.#shouldLog(LogLevel.ERROR)) return;

    // eslint-disable-next-line no-console
    console.error(`[ReactDesignTokens] ${message}`, ...args);
  }
}
