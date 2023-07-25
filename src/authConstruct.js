import { watchEffect } from "vue";

export default class AuthControl {
  constructor(options) {
    this.authCodeList = options.authCodeList;
  }
  isPermission = (value) => {
    if (!value) {
      return true;
    }
    return this.authCodeList.includes(value);
  };
  removeElement = (el) => {
    el._parentNode = el.parentNode;
    el._placeholderNode = document.createComment("auth");
    el.parentNode?.replaceChild(el._placeholderNode, el);
  };
  addElement = (el) => {
    el._parentNode?.replaceChild(el, el._placeholderNode);
  };
  authInMounted = (el, binding) => {
    const value = binding.value;
    if (!value) return;
    if (!this.isPermission(value)) {
      this.removeElement(el);
    }
  };
  authInUpdated = (el, binding) => {
    const dataUpdated = () => {
      if (binding.value === binding.oldValue) return;
      const permissionBeforeUpdate = this.isPermission(binding.oldValue);
      const permissionAfterUpdate = this.isPermission(binding.value);
      if (permissionBeforeUpdate === permissionAfterUpdate) return;
      if (permissionAfterUpdate) {
        this.addElement(el);
      } else {
        this.removeElement(el);
      }
    };
    if (el._watchEffect) {
      dataUpdated();
    } else {
      el._watchEffect = watchEffect(() => {
        dataUpdated();
      });
    }
  };
}
