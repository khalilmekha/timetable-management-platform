import colors from "ansi-colors";

export class Logger {
  public static logError(error: unknown, panic = false): void {
    const err = error as Error;

    console.log(
      `${colors.red.underline.bold("Error:")} ${colors.green.bold(
        err.name
      )} ${colors.red.bold(err.message)}\n${colors.white(err.stack || "no stack")}`
    );
    if (panic) process.exit(1);
  }
  public static logErrorMessage(message: string, panic = false): void {
    console.log(
      `${colors.red.underline.bold("Error:")} ${colors.red.bold(message)}\n`
    );
    if (panic) process.exit(1);
  }

  public static logWarningMessage(warning: string): void {
    console.log(
      `${colors.yellow.underline.bold("Warning:")} ${colors.red.bold(warning)}\n`
    );
  }

  public static logInfoMessage(info: string): void {
    console.log(
      `${colors.blue.underline.bold("Info:")} ${colors.blue.bold(info)}\n`
    );
  }
}
