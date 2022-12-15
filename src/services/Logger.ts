export interface LogInterface {
    debug(primaryMessage: string, ...supportingData: unknown[]): void;
    info(primaryMessage: string, ...supportingData: unknown[]): void;
    warn(primaryMessage: string, ...supportingData: unknown[]): void;
    error(primaryMessage: string, ...supportingData: unknown[]): void;
    setDebugMode(isDebugModeEnabled: boolean): void;
    setLevelInfo(value: string): void;
}

const LevelInfoRecord: Record<string, number> = {
    debug: 3,
    info: 2,
    warn: 1,
    error: 0
};
class Log implements LogInterface {
    private static instance: LogInterface;
    private isDebugModeEnabled: boolean;
    private levelInfo: number;
    private constructor() {
        this.isDebugModeEnabled = false;
        this.levelInfo = 0;
    }

    public debug(primaryMessage: string, ...supportingData: unknown[]) {
        if (this.levelInfo >= LevelInfoRecord.debug) {
            this.emitLogMessage("debug", primaryMessage, ...supportingData);
        }
    }
    public info(primaryMessage: string, ...supportingData: unknown[]) {
        if (this.levelInfo >= LevelInfoRecord.info) {
            this.emitLogMessage("info", primaryMessage, ...supportingData);
        }
    }
    public warn(primaryMessage: string, ...supportingData: unknown[]) {
        if (this.levelInfo >= LevelInfoRecord.warn) {
            this.emitLogMessage("warn", primaryMessage, ...supportingData);
        }
    }
    public error(primaryMessage: string, ...supportingData: unknown[]) {
        if (this.levelInfo >= LevelInfoRecord.error) {
            this.emitLogMessage("error", primaryMessage, ...supportingData);
        }
    }

    public setDebugMode(isDebugModeEnabled: boolean) {
        this.isDebugModeEnabled = isDebugModeEnabled;
    }

    public setLevelInfo(value: string) {
        this.levelInfo = LevelInfoRecord[value];
    }

    public static getInstance(): LogInterface {
        if (!Log.instance) {
            Log.instance = new Log();
        }

        return Log.instance;
    }

    private emitLogMessage(level: "debug" | "info" | "warn" | "error", message: string, ...supportingData: unknown[]): void {
        // Do not log if debug mode is disabled
        if (!this.isDebugModeEnabled) {
            return;
        }
        const moment: string = new Date().toISOString();
        if (supportingData.length > 0) {
            console.log(`[${moment}] [${level}] ${message}`, supportingData);
        } else {
            console.log(`[${moment}] [${level}] ${message}`);
        }
    }
}

export const LOGGER = Log.getInstance();