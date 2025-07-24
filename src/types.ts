import {codemods} from 'module-replacements-codemods';

export interface PackFile {
  name: string;
  data: string | ArrayBuffer | Uint8Array;
}

export type PackType =
  | 'auto'
  | 'npm'
  | 'yarn'
  | 'pnpm'
  | 'bun'
  | 'none'
  | {tarball: ArrayBuffer};

export interface Options {
  root?: string;
  pack?: PackType;
  features?: string;
}

export interface Message {
  severity: 'error' | 'warning' | 'suggestion';
  score: number;
  message: string;
}

export interface DependencyNode {
  name: string;
  version: string;
  // TODO (43081j): make this an array or something structured one day
  path: string; // Path in dependency tree (e.g., "root > package-a > package-b")
  parent?: string; // Parent package name
  depth: number; // Depth in dependency tree
  packagePath: string; // File system path to package.json
}

export interface DuplicateDependency {
  name: string;
  versions: DependencyNode[];
  severity: 'exact' | 'conflict' | 'resolvable';
  potentialSavings?: number;
  suggestions?: string[];
}

export interface DependencyStats {
  totalDependencies: number;
  directDependencies: number;
  devDependencies: number;
  cjsDependencies: number;
  esmDependencies: number;
  installSize: number;
  packageName?: string;
  version?: string;
  duplicateDependencies?: DuplicateDependency[];
}

export interface DependencyAnalyzer {
  analyzeDependencies(root?: string): Promise<DependencyStats>;
}

export interface PackageJsonLike {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface Replacement {
  from: string;
  to: string;
  condition?: (filename: string, source: string) => Promise<boolean>;
  factory: (typeof codemods)[keyof typeof codemods];
}
