/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-quill-editor',

  included: function (app) {
    this._super.included.apply(this, arguments);

    // this.ui.writeLine('[ember-quill-editor] including external files!');

    // Transitional imported quill via vendor because it isn't easy to integrate clean via bower or npm

    app.import('vendor/quill.js', { prepend: true });
    app.import('vendor/quill.snow.css');

  }

};
