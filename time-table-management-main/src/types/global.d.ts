declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      PORT: string;
      MONGO_URI: string;
      DATABASE_NAME: string;
      [key: string]: string | undefined;
    }

    
  }

  interface String {
    format(record: Record<string, string>): string;
    toTitleCase(): string;
    toCamelCase(firstCapital?: boolean): string;
  }
}

export {};