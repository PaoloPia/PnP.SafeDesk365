import { ISPFxAdaptiveCard, IActionArguments, BaseAdaptiveCardView } from '@microsoft/sp-adaptive-card-extension-base';
import * as strings from 'SafeDesk365AceAdaptiveCardExtensionStrings';
import { ISafeDesk365AceAdaptiveCardExtensionProps } from '../ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from '../ISafeDesk365AceAdaptiveCardExtensionState';

export interface IBookingDoneQuickViewData {
  bookingId: number
}

export class BookingDoneQuickView extends BaseAdaptiveCardView<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState,
  IBookingDoneQuickViewData
> {
  public get data(): IBookingDoneQuickViewData {
    return {
      bookingId: this.state.bookingId
    };
  }

  public get template(): ISPFxAdaptiveCard {
    return require('./template/BookingDoneTemplate.json');
  }
}