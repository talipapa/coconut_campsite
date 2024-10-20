/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(auth)` | `/(auth)/login` | `/(auth)\_layout` | `/(auth)\login\` | `/(main)` | `/(main)/(tabs)` | `/(main)/(tabs)/home` | `/(main)/(tabs)/settings` | `/(main)/(tabs)/wallet` | `/(main)/booking/CashBookingButtons` | `/(main)/booking/RescheduleComponent` | `/(main)/booking/XenditBookingButtons` | `/(main)/bookings` | `/(main)/home` | `/(main)/settings` | `/(main)/wallet` | `/(main)\(tabs)\_layout` | `/(main)\(tabs)\home\` | `/(main)\(tabs)\settings\` | `/(main)\(tabs)\wallet\` | `/(main)\_layout` | `/(main)\booking\CashBookingButtons` | `/(main)\bookings` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/settings` | `/(tabs)/wallet` | `/..\Context\GlobalProvider` | `/..\components\BookingCard` | `/..\components\CalenderField` | `/..\components\ContentBody` | `/..\components\CustomButton` | `/..\components\FormField` | `/..\components\MainHeader` | `/..\components\ToastMessage` | `/..\components\home\BookingList` | `/..\components\ui\box\` | `/..\components\ui\box\index.web` | `/..\components\ui\box\styles` | `/..\components\ui\gluestack-ui-provider\` | `/..\components\ui\gluestack-ui-provider\config` | `/..\components\ui\gluestack-ui-provider\index.web` | `/..\components\ui\gluestack-ui-provider\script` | `/..\utils\AuthService` | `/..\utils\BookingService` | `/..\utils\PriceService` | `/..\utils\TokenService` | `/..\utils\axios` | `/_sitemap` | `/booking/CashBookingButtons` | `/booking/RescheduleComponent` | `/booking/XenditBookingButtons` | `/bookings` | `/home` | `/login` | `/settings` | `/wallet`;
      DynamicRoutes: `/(main)/booking/${Router.SingleRoutePart<T>}` | `/booking/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(main)/booking/[id]` | `/booking/[id]`;
    }
  }
}
