
type LogParams = any[]; 

const isLoggingEnabled = __DEV__;

export const logInfo = (message: string, ...optionalParams: LogParams): void => {
    if (isLoggingEnabled) {
        console.info(`[INFO]: ${message}`, ...optionalParams);
    }
};

export const logWarn = (message: string, ...optionalParams: LogParams): void => {
    if (isLoggingEnabled) {
        console.warn(`[WARNING]: ${message}`, ...optionalParams);
    }
};

export const logError = (message: string, ...optionalParams: LogParams): void => {
    if (isLoggingEnabled) {
        const error = new Error();
        console.error(`[ERROR]: ${message}`, ...optionalParams, `\nStack Trace:\n${error.stack}`);
    }
};
