export interface ISuscriberQueryResponse {
    data?: INovuSubscriber
    loading?: boolean
    networkStatus?: number
    errors?: any
}


export interface INovuSubscriber {
    subscriberQuery: {
        id?: string
        subscriberId?: string
        firstName?: string
        lastName?: string
        email?: string
        phone?: string
        isOnline?: boolean
        lastOnlineAt?: string
        deleted?: boolean
        createdAt?: string
        updatedAt?: string
        channels?: INovuSubscriberChannel[]
    }
}

export interface INovuSubscriberChannel {
    _integrationId?: string
    providerId?: string
    credentials?: INovuChannelCredential
}

export interface INovuChannelCredential {
    title?: string
    webhookUrl?: string
    channel?: string
    deviceTokens?: string[]
}