import { Injectable } from "@angular/core";
import { Apollo, gql, graphql } from "apollo-angular";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class NovuApiService {

    constructor(private apollo: Apollo) { }

    SUBSCRIBER_QUERY = gql(`
        query SubscriberQuery($id: ID!) {
            subscriberQuery(id: $id) {
                channels {
                    _integrationId
                    providerId
                    credentials {
                        title
                        webhookUrl
                        channel
                        deviceTokens
                    }
                }
                id
                email
                subscriberId
            }
        }
    `);

    SUBSCRIBER_CREDENTIALS_MUTATION = gql(`
        mutation SubscriberCredentialsMutation(
            $id: ID!
            $providerIdEnum: String!
            $credentials: UpdateSubscriberCredentials!
            $providerId: String!
            )
            {
                subscriberCredentialsMutation(
                    id: $id
                    providerIdEnum: $providerIdEnum
                    credentials: $credentials
                    providerId: $providerId
                ) {
                    id
                    subscriberId
                    email
                    channels {
                        providerId
                        credentials {
                            title
                            webhookUrl
                            channel
                            deviceTokens
                        }
                    }
                }
            }
    `);


    getSubscriber(id: string): Observable<any> {
        return this.apollo.watchQuery({
            query: this.SUBSCRIBER_QUERY,
            variables: { id }
        }).valueChanges
    }

    updateSubscriberCredentials(id: string, providerIdEnum: string, deviceTokens: string[], providerId: string): Observable<any> {
        return this.apollo.mutate({
            mutation: this.SUBSCRIBER_CREDENTIALS_MUTATION,
            variables: {
                id,
                providerIdEnum,
                credentials: {
                    deviceTokens,
                },
                providerId
            }
        })
    }


}