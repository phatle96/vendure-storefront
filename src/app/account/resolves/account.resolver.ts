import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { EMPTY, Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { GetActiveCustomerQuery } from "src/app/common/generated-types";
import { GET_ACTIVE_CUSTOMER } from "src/app/common/graphql/documents.graphql";
import { DataService } from "src/app/core/providers/data/data.service";
import { StateService } from "src/app/core/providers/state/state.service";

export const accountResolver: ResolveFn<any> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> => {
        const dataService = inject(DataService);
        const stateService = inject(StateService)
        switch (state.url) {
            case '/account':
                return dataService.query<GetActiveCustomerQuery>(GET_ACTIVE_CUSTOMER, {}, 'network-only').pipe(
                    mergeMap((customerData) => {
                        if (customerData) {
                            stateService.setState('userEmail', customerData.activeCustomer?.emailAddress ?? null)
                            stateService.setState('firstName', customerData.activeCustomer?.firstName ?? null)
                            stateService.setState('lastName', customerData.activeCustomer?.lastName ?? null)
                            stateService.setState('signedIn', true)
                            return of(customerData)
                        } else {
                            return EMPTY
                        }
                    })
                );
            default:
                return EMPTY
        }
    }