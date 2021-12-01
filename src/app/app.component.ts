import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Logger } from "src/app/services/logger.service";
import { IShow } from "./shows/show.interface";
import { ShowService } from "./shows/show.service";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  public newShowFormGroup: FormGroup;

  constructor(
    private logger: Logger,
    public showService: ShowService,
    formBuilder: FormBuilder
  ) {
    this.newShowFormGroup = formBuilder.group({
      name: ["", [Validators.required]],
    });

    const shows = this.getShows();
  }

  public deleteShow(show: IShow) {
    this.showService.deleteShow(show.name);
  }

  public addNewShow() {
    if (this.newShowFormGroup.invalid) {
      this.newShowFormGroup.markAllAsTouched();
      return;
    }

    const name = this.newShowFormGroup.value.name;

    this.showService.addShow(name);
    this.newShowFormGroup.reset();
  }

  public getShows() {
    console.log("Getting new shows!");
    return this.showService.retrieveShows();
  }
}
