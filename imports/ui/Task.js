import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './Task.html';

Template.Task.helpers({
  categoryClass() {
    return this.category.toLowerCase();
  },
});

Template.Task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },

  'click .delete-task'() {
    Meteor.call('tasks.remove', this._id);
  },
});