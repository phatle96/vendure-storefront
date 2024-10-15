import { Injectable } from "@angular/core";
import { Novu } from "@novu/js";
import { MessageService } from "primeng/api";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class NovuSocketService {
    constructor(
        private messageService: MessageService
    ) { }

    novu: Novu;

    init(userId: string) {
        this.novu = new Novu({
            subscriberId: userId,
            applicationIdentifier: environment.novuApplicationIdentifier,
        });
        this.novu.on("notifications.notification_received", (data) => {
            console.log("new notification =>", data);
            this.messageService.add({ severity: 'info', summary: data.result.subject, detail: data.result.body });
        });
    }

}