import lodash from "lodash";
const { isArray, intersection } = lodash;
import { watchEffect } from "vue";

export default class AuthControl {
  constructor(options) {
    console.log("===自定义指令注入配置1222");
    this.authCodeList = options.authCodeList;
  }
  isPermission = (value) => {
    if (!value) {
      return true;
    }
    if (!isArray(value)) {
      return this.authCodeList.includes(value);
    }
    return intersection(value, this.authCodeList).length > 0;
  };
  removeElement = (el) => {
    el._parentNode = el.parentNode;
    el._placeholderNode = document.createComment("auth");
    el.parentNode?.replaceChild(el._placeholderNode, el);
    console.log("===移除节点");
  };
  addElement = (el) => {
    el._parentNode?.replaceChild(el, el._placeholderNode);
    console.log("===增加节点");
  };
  authInMounted = (el, binding) => {
    const value = binding.value;
    console.log("===指令初始化成功");
    if (!value) return;
    if (!this.isPermission(value)) {
      this.removeElement(el);
    }
  };
  authInUpdated = (el, binding) => {
    const dataUpdated = () => {
      console.log(binding.value, binding.oldValue, "===调用dataUpdated");
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
      console.log("===bind值变化");
    } else {
      el._watchEffect = watchEffect(() => {
        dataUpdated();
      });
      console.log("===挂载一个watchEffect");
    }
  };
}
