import _tmpl from "./test.html";
import { registerComponent as _registerComponent } from "lwc";
export default _registerComponent(class {
  @track
  foo;
}, {
  tmpl: _tmpl,
  sel: "lwc-test",
  v: 59
});
;