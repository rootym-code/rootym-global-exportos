export type FollowUpCacheLogLevel =
  | "info"
  | "warn"
  | "error"
  | "debug";

export interface FollowUpCacheLogEntry {
  level: FollowUpCacheLogLevel;
  message: string;
  key?: string;
  timestamp: Date;
}

export class FollowUpCacheLogger {
  private enabled = true;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  log(
    level: FollowUpCacheLogLevel,
    message: string,
    key?: string,
  ) {
    if (!this.enabled) {
      return;
    }

    const entry: FollowUpCacheLogEntry = {
      level,
      message,
      key,
      timestamp: new Date(),
    };

    switch (level) {
      case "error":
        console.error(entry);
        break;

      case "warn":
        console.warn(entry);
        break;

      case "debug":
        console.debug(entry);
        break;

      default:
        console.info(entry);
    }
  }

  info(
    message: string,
    key?: string,
  ) {
    this.log(
      "info",
      message,
      key,
    );
  }

  warn(
    message: string,
    key?: string,
  ) {
    this.log(
      "warn",
      message,
      key,
    );
  }

  error(
    message: string,
    key?: string,
  ) {
    this.log(
      "error",
      message,
      key,
    );
  }

  debug(
    message: string,
    key?: string,
  ) {
    this.log(
      "debug",
      message,
      key,
    );
  }
}

const followUpCacheLogger =
  new FollowUpCacheLogger();

export default followUpCacheLogger;