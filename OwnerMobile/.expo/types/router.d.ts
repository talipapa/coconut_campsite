/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/login` | `/(main)` | `/(main)/home` | `/(main)/settings` | `/(main)/wallet` | `/_sitemap` | `/home` | `/login` | `/settings` | `/wallet`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
