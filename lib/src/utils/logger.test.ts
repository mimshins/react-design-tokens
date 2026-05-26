import { afterEach, describe, expect, it, vi } from "vitest";
import { LogLevel, Logger } from "./logger.ts";

describe("Logger", () => {
  const spies = {
    debug: vi.spyOn(console, "debug").mockImplementation(() => {}),
    info: vi.spyOn(console, "info").mockImplementation(() => {}),
    warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    error: vi.spyOn(console, "error").mockImplementation(() => {}),
  };

  afterEach(() => vi.clearAllMocks());

  it("logs at and above the configured level", () => {
    const logger = new Logger(LogLevel.WARN);

    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");
    expect(spies.debug).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
    expect(spies.warn).toHaveBeenCalledOnce();
    expect(spies.error).toHaveBeenCalledOnce();
  });

  it("logs nothing when level is NONE", () => {
    const logger = new Logger(LogLevel.NONE);

    logger.warn("w");
    logger.error("e");
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.error).not.toHaveBeenCalled();
  });

  it("logs everything when level is DEBUG", () => {
    const logger = new Logger(LogLevel.DEBUG);

    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");
    expect(spies.debug).toHaveBeenCalledOnce();
    expect(spies.info).toHaveBeenCalledOnce();
    expect(spies.warn).toHaveBeenCalledOnce();
    expect(spies.error).toHaveBeenCalledOnce();
  });

  it("defaults to WARN level", () => {
    const logger = new Logger();

    logger.info("i");
    logger.warn("w");
    expect(spies.info).not.toHaveBeenCalled();
    expect(spies.warn).toHaveBeenCalledOnce();
  });
});
