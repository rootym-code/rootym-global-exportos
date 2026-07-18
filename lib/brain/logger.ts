/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/logger.ts
 * ------------------------------------------------------------
 * Central logger for the ROOTYM Brain Engine.
 * All Brain modules should log through this class.
 * ============================================================
 */

import type {
    BrainAction,
    BrainLogEntry,
    BrainModule,
  } from "./types";
  
  export class BrainLogger {
    private static format(entry: BrainLogEntry): string {
      return [
        "[ROOTYM Brain]",
        `[${entry.level}]`,
        `[${entry.module}]`,
        `[${entry.action}]`,
        entry.message,
      ].join(" ");
    }
  
    private static write(entry: BrainLogEntry): void {
      const formatted = this.format(entry);
  
      switch (entry.level) {
        case "ERROR":
          console.error(formatted, entry.metadata ?? {});
          break;
  
        case "WARN":
          console.warn(formatted, entry.metadata ?? {});
          break;
  
        default:
          console.info(formatted, entry.metadata ?? {});
          break;
      }
    }
  
    static info(
      module: BrainModule,
      action: BrainAction,
      message: string,
      metadata?: Record<string, unknown>,
    ): void {
      this.write({
        level: "INFO",
        module,
        action,
        message,
        metadata,
        timestamp: new Date(),
      });
    }
  
    static warn(
      module: BrainModule,
      action: BrainAction,
      message: string,
      metadata?: Record<string, unknown>,
    ): void {
      this.write({
        level: "WARN",
        module,
        action,
        message,
        metadata,
        timestamp: new Date(),
      });
    }
  
    static error(
      module: BrainModule,
      action: BrainAction,
      message: string,
      metadata?: Record<string, unknown>,
    ): void {
      this.write({
        level: "ERROR",
        module,
        action,
        message,
        metadata,
        timestamp: new Date(),
      });
    }
  }