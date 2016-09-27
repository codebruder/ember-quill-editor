import Ember from 'ember';
import layout from '../templates/components/quill-editor';

export default Ember.Component.extend({
  layout,
  tagName: 'div',
  classNames: ['ember-quill-editor'],

  didInsertElement() {
    this._super(...arguments);

    let component = this;

    class Counter {
      constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.container = component.$(options.container).get(0);
        quill.on('text-change', this.update.bind(this));
        this.update();  // Account for initial contents
      }

      calculate() {
        let text = this.quill.getText();
        if (this.options.unit === 'word') {
          text = text.trim();
          // Splitting empty text returns a non-empty array
          return text.length > 0 ? text.split(/\s+/).length : 0;
        } else {
          return text.length;
        }
      }

      update() {
        var length = this.calculate();
        var label = this.options.unit;
        if (length !== 1) {
          label += 's';
        }
        this.container.innerHTML = length + ' ' + label;
      }
    }

    Quill.register('modules/counter', Counter);

    let Inline = Quill.import('blots/inline');

    class ProcessLinkBlot extends Inline {
      static create(url) {
        let node = super.create();
        // Sanitize url if desired
        node.setAttribute('href', url);
        // Okay to set other non-format related attributes
        node.setAttribute('target', '_blank');
        return node;
      }

      static formats(node) {
        // We will only be called with a node already
        // determined to be a Link blot, so we do
        // not need to check ourselves
        return node.getAttribute('href');
      }
    }
    ProcessLinkBlot.blotName = 'processlink';
    ProcessLinkBlot.tagName = 'a';

    Quill.register(ProcessLinkBlot);

    var quill = new Quill(this.$('#editor').get(0), {
      modules: {
        counter: {
          container: '#counter',
          unit: 'word'
        }
      },
      theme: 'snow'
    });

    this.$('#processlink-button').click(function() {
      let value = prompt('Enter link URL');
      quill.format('link', value);
    });

    this.set('quill', quill);

  },

  willDestroyElement: function() {
    // quill has no destroy method because it get garbage collected after the element is deleted
    if (this.get('quill')) {
      this.set('quill', null);
    }
  }

});
