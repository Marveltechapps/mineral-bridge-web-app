/**
 * Values the platform screens render against. Built by `PlatformController.renderVals()`
 * from the controller state: strings, flags, lists and event handlers keyed by name.
 */
import type { Actor, Category, OrderKind, Product, Stage } from './mineralBridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ViewModel = Record<string, any>;

export type MineralPair = [id: string, name: string];

/** A catalogue category (loaded from `GET /v2/categories`). */
export type MineralCategory = Category;

export type AccountTypeOption = [id: string, name: string, description: string];

export type { Actor, OrderKind, Product, Stage };
