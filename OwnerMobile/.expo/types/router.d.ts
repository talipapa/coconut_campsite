/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/login` | `/(main)` | `/(main)/(tabs)` | `/(main)/(tabs)/home` | `/(main)/(tabs)/settings` | `/(main)/(tabs)/wallet` | `/(main)/bookings` | `/(main)/home` | `/(main)/settings` | `/(main)/wallet` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/settings` | `/(tabs)/wallet` | `/_sitemap` | `/bookings` | `/home` | `/login` | `/settings` | `/wallet`;
      DynamicRoutes: `/(main)/booking/${Router.SingleRoutePart<T>}` | `/booking/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(main)/booking/[id]` | `/booking/[id]`;
    }
  }
}
