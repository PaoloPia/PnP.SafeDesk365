import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseAdaptiveCardExtension } from '@microsoft/sp-adaptive-card-extension-base';
import { CardView } from './cardView/CardView';
import { BookSelectionQuickView } from './quickView/BookSelectionQuickView';
import { BookFreeQuickView } from './quickView/BookFreeQuickView';
import { BookSpecificQuickView } from './quickView/BookSpecificQuickView';
import { BookingDoneQuickView } from './quickView/BookingDoneQuickView';
import { CheckInQuickView } from './quickView/CheckInQuickView';
import { CheckOutQuickView } from './quickView/CheckOutQuickView';
import { SafeDesk365AcePropertyPane } from './SafeDesk365AcePropertyPane';

import { ISafeDesk365AceAdaptiveCardExtensionProps } from './ISafeDesk365AceAdaptiveCardExtensionProps';
import { ISafeDesk365AceAdaptiveCardExtensionState } from './ISafeDesk365AceAdaptiveCardExtensionState';

import { SafeDesk365Client } from '../../services/safeDesk365Client/SafeDesk365Client';
import { AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

const CARD_VIEW_REGISTRY_ID: string = 'SafeDesk365Ace_CARD_VIEW';
export const QUICK_VIEW_CHECKIN_ID: string = 'SafeDesk365Ace_QV_CHECKIN';
export const QUICK_VIEW_CHECKOUT_ID: string = 'SafeDesk365Ace_QV_CHECKOUT';
export const QUICK_VIEW_BOOK_SELECTION_ID: string = 'SafeDesk365Ace_QV_BOOK_SELECTION';
export const QUICK_VIEW_BOOK_FREE_ID: string = 'SafeDesk365Ace_QV_BOOK_FREE';
export const QUICK_VIEW_BOOK_SPECIFIC_ID: string = 'SafeDesk365Ace_QV_BOOK_SPECIFIC';
export const QUICK_VIEW_BOOK_DONE_ID: string = 'SafeDesk365Ace_QV_BOOK_DONE';


export default class SafeDesk365AceAdaptiveCardExtension extends BaseAdaptiveCardExtension<
  ISafeDesk365AceAdaptiveCardExtensionProps,
  ISafeDesk365AceAdaptiveCardExtensionState
> {
  private _deferredPropertyPane: SafeDesk365AcePropertyPane | undefined;

  public async onInit(): Promise<void> {
    this.state = {
      loading: true,
      locations: undefined,
      desks: undefined
    };

    this.cardNavigator.register(CARD_VIEW_REGISTRY_ID, () => new CardView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKIN_ID, () => new CheckInQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_CHECKOUT_ID, () => new CheckOutQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_SELECTION_ID, () => new BookSelectionQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_FREE_ID, () => new BookFreeQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_SPECIFIC_ID, () => new BookSpecificQuickView());
    this.quickViewNavigator.register(QUICK_VIEW_BOOK_DONE_ID, () => new BookingDoneQuickView());
    
    setTimeout(this.fetchData, 200);

    return Promise.resolve();
  }

  protected loadPropertyPaneResources(): Promise<void> {
    return import(
      /* webpackChunkName: 'SafeDesk365Ace-property-pane'*/
      './SafeDesk365AcePropertyPane'
    )
      .then(
        (component) => {
          this._deferredPropertyPane = new component.SafeDesk365AcePropertyPane();
        }
      );
  }

  protected renderCard(): string | undefined {
    return CARD_VIEW_REGISTRY_ID;
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return this._deferredPropertyPane!.getPropertyPaneConfiguration();
  }

  private fetchData = async () => {

    // Initialize the SafeDesk365 Client if it is not yet initialized
    if (!this.properties.safeDesk365) {

      // Initialize the AAD OAuth Token Provider, first
      const tokenProvider = await this.context.aadTokenProviderFactory.getTokenProvider();
      const accessToken: string = await tokenProvider.getToken(this.properties.safeDesk365ApiId);

      // Then create a new instance of the SafeDesk365 Client
      this.properties.safeDesk365 = new SafeDesk365Client(
        this.properties.safeDesk365ApiUri, 
        accessToken, 
        this.context.pageContext.user.email);
    }

    // Get the whole list of locations
    const locations = await this.properties.safeDesk365.getLocations();

    // Get the whole list of desks
    const desks = await this.properties.safeDesk365.getDesks();

    // Get the whole list of bookings for the current user
    const bookings = await this.properties.safeDesk365.getBookings();
    
    this.setState({
      loading: false,
      locations: locations,
      desks: desks,
      bookings: bookings
    });
  }
}
