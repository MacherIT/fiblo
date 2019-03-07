export default {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        dirtyForm() {
          return Object.keys(this.fields).some(field => this.fields[field].dirty);
        },
        validForm() {
          if (!this.dirtyForm) {
            return false;
          }
          return Object.keys(this.fields).every(field => this.fields[field].valid);
        },
      },
      methods: {
        stripHtml(html) {
          return (
            !html ||
            html
              .replace(/<(?:.|\n)*?>/gm, ' ')
              .replace(/&.*;/gm, ' ')
              .trim()
          );
        },
      },
    });
  },
};
