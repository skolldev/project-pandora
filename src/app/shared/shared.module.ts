import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

const COMPONENTS: any = [];
const PIPES: any = [];
@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [CommonModule],
  exports: [...COMPONENTS, ...PIPES],
})
export class SharedModule {}
