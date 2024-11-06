import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import { GetActiveCustomerQuery } from '../../../common/generated-types';
import { GET_ACTIVE_CUSTOMER } from '../../../common/graphql/documents.graphql';
import { DataService } from '../../providers/data/data.service';
import { StateService } from '../../providers/state/state.service';

import { NovuSocketService } from '../../services/novu-socket.service';
import { NovuApiService } from '../../services/novu-api.service';
import { FcmService } from '../../services/fcm.service';
import { ISuscriberQueryResponse } from '../../services/novu-api.type';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'vsf-account-link',
    templateUrl: './account-link.component.html',
    // styleUrls: ['./account-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountLinkComponent implements OnInit {

    activeCustomer$: Observable<GetActiveCustomerQuery['activeCustomer']>;
    constructor(
        private dataService: DataService,
        private stateService: StateService,
        private novuSocketService: NovuSocketService,
        private novuApiService: NovuApiService,
    ) { }

    ngOnInit() {
        const getActiveCustomer$ = this.dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {}, 'network-only');

        getActiveCustomer$.pipe(take(1)).subscribe(data => {
            if (data.activeCustomer) {
                this.stateService.setState('signedIn', true);
                this.stateService.setState('userId', data.activeCustomer.id);
                this.novuSocketService.init(data.activeCustomer.id);

                this.novuApiService.getSubscriber(data.activeCustomer.id).subscribe(

                    (result: ISuscriberQueryResponse) => {
                        if (!result.errors && result.data?.subscriberQuery) {
                            // Set user FCM device token
                            const channels = result.data.subscriberQuery.channels
                            if (channels && channels.length > 0) {
                                const fcmChannel = channels.filter((channel) => channel.providerId == "fcm")
                                if (fcmChannel.length && fcmChannel[0].credentials) {
                                    this.stateService.setState('fcmDeviceTokens', fcmChannel[0].credentials.deviceTokens!)
                                    this.stateService.select(state => state.deviceToken).subscribe(
                                        (deviceToken) => {
                                            let tokens = fcmChannel[0].credentials?.deviceTokens
                                            if (deviceToken && tokens?.length) {
                                                if (!tokens.includes(deviceToken)) {
                                                    tokens = [...tokens.slice(-10), deviceToken]
                                                    this.novuApiService.updateSubscriberCredentials(data.activeCustomer!.id, "fcm", tokens, environment.pushProviderIdentifier).subscribe()
                                                }
                                            }
                                        }
                                    )
                                }
                            }

                        }
                    },
                    (error) => {
                        console.log("🚀 ~ AccountLinkComponent ~ getActiveCustomer$.pipe ~ error:", error)
                    }
                )
            }
        });

        this.activeCustomer$ = this.stateService.select(state => state.signedIn).pipe(
            switchMap(() => getActiveCustomer$),
            map(data => data && data.activeCustomer),
        );
    }

    userName(customer: NonNullable<GetActiveCustomerQuery['activeCustomer']>): string {
        const { firstName, lastName, emailAddress } = customer;
        if (firstName && lastName) {
            return `${firstName} ${lastName}`;
        } else {
            return emailAddress;
        }
    }

}
