import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { GetCollectionsQuery } from '../../../common/generated-types';
import { DataService } from '../../providers/data/data.service';

import { SidebarModule } from 'primeng/sidebar';
import { FcmService } from '../../services/fcm.service';

@Component({
    selector: 'vsf-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {

    collections$: Observable<GetCollectionsQuery['collections']['items']>;
    heroImage: SafeUrl;
    sidebarVisible: boolean = true;
    permission: string;

    constructor(
        private dataService: DataService,
        private fcmService: FcmService
    ) {
        this.permission = this.fcmService.permission
    }

    ngOnInit(): void {
        this.collections$ = this.dataService.query<GetCollectionsQuery>(GET_COLLECTIONS, {
            options: { take: 50 },
        }).pipe(map(({collections}) => collections.items));
        this.heroImage = this.getHeroImageUrl();
    }

    private getHeroImageUrl(): string {
        const {apiHost, apiPort} = environment;
        return `${apiHost}:${apiPort}/assets/preview/a2/thomas-serer-420833-unsplash__preview.jpg`;
    }

}

const GET_COLLECTIONS = gql`
    query GetCollections($options: CollectionListOptions) {
        collections(options: $options) {
            items {
                id
                name
                slug
                parent {
                    id
                    slug
                    name
                }
                featuredAsset {
                    id
                    preview
                }
            }
        }
    }
`;
