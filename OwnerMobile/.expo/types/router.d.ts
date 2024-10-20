/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/login` | `/(main)` | `/(main)/(tabs)` | `/(main)/(tabs)/home` | `/(main)/(tabs)/settings` | `/(main)/(tabs)/wallet` | `/(main)/booking/CashBookingButtons` | `/(main)/booking/RescheduleComponent` | `/(main)/booking/XenditBookingButtons` | `/(main)/bookings` | `/(main)/cashout` | `/(main)/home` | `/(main)/profile` | `/(main)/settings` | `/(main)/wallet` | `/(main)\profile\change-password\` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/settings` | `/(tabs)/wallet` | `/..\utils\AccountService` | `/_sitemap` | `/booking/CashBookingButtons` | `/booking/RescheduleComponent` | `/booking/XenditBookingButtons` | `/bookings` | `/cashout` | `/home` | `/login` | `/profile` | `/settings` | `/wallet`;
      DynamicRoutes: `/(main)/booking/${Router.SingleRoutePart<T>}` | `/booking/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(main)/booking/[id]` | `/booking/[id]`;
    }
  }
}
