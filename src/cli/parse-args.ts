import * as commandLineArgs from "command-line-args";
import * as semver from "semver";
import { VersionBumpOptions } from "../version-bump-options";
import { isVersionBumpType } from "../version-bump-type";

/**
 * The parsed command-line arguments
 */
export interface ParsedArgs {
  help?: boolean;
  version?: boolean;
  options: VersionBumpOptions;
}

/**
 * Parses the command-line arguments
 */
export function parseArgs(argv: string[]): ParsedArgs {
  let args = commandLineArgs(
    [
      { name: "preid", type: String },
      { name: "commit", alias: "c", type: String },
      { name: "tag", alias: "t", type: String },
      { name: "push", alias: "p", type: Boolean },
      { name: "all", alias: "a", type: Boolean },
      { name: "version", alias: "v", type: Boolean },
      { name: "help", alias: "h", type: Boolean },
      { name: "files", type: String, multiple: true, defaultOption: true },
    ],
    { argv }
  );

  let parsedArgs: ParsedArgs = {
    help: args.help as boolean,
    version: args.version as boolean,
    options: {
      preid: args.preid as string,
      commit: args.commit as string | boolean,
      tag: args.tag as string | boolean,
      push: args.push as boolean,
      all: args.all as boolean,
      files: args.files as string[],
    }
  };

  // If --preid is used without an argument, then throw an error, since it's probably a mistake.
  // If they want to use the default value ("beta"), then they should not pass the argument at all
  if (args.preid === null) {
    throw new Error(`The --preid option requires a value, such as "alpha", "beta", etc.`);
  }

  // If --commit is used without an argument, then treat it as a boolean flag
  if (args.commit === null) {
    parsedArgs.options.commit = true;
  }

  // If --tag is used without an argument, then treat it as a boolean flag
  if (args.tag === null) {
    parsedArgs.options.tag = true;
  }

  // If a version number or bump type was specified, then it will mistakenly be added to the "files" array
  if (parsedArgs.options.files && parsedArgs.options.files.length > 0) {
    let firstArg = parsedArgs.options.files[0];

    if (isVersionBumpType(firstArg) || semver.valid(firstArg)) {
      parsedArgs.options.version = firstArg;
      parsedArgs.options.files.shift();
    }
  }

  return parsedArgs;
}
