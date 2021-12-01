import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { IShow } from "../show.interface";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
})
export class CardComponent implements OnInit {
  ngOnInit() {
    console.log("CardComponent initialized");
  }

  @HostBinding("class")
  public class = "block";

  @Input()
  public show?: IShow;

  @Output()
  public deleteClicked = new EventEmitter<IShow>();
}
