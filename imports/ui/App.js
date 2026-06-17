import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Sortable from 'sortablejs';

import { TasksCollection } from '../api/TasksCollection.js';

import './Task.js';
import './App.html';

Template.App.onCreated(function appCreated() {
  this.selectedCategory = new ReactiveVar('All');

  this.subscribe('tasks');
});

Template.App.onRendered(function appRendered() {
  const list = document.getElementById('task-list');

  Sortable.create(list, {
    animation: 150,
    handle: '.drag-handle',

    onEnd() {
      const taskItems = document.querySelectorAll('.task-item');

      taskItems.forEach((item, index) => {
        const taskId = item.getAttribute('data-id');
        Meteor.call('tasks.updateOrder', taskId, index);
      });
    },
  });
});

Template.App.helpers({
  tasks() {
    const instance = Template.instance();
    const selectedCategory = instance.selectedCategory.get();

    const query = {};

    if (selectedCategory !== 'All') {
      query.category = selectedCategory;
    }

    return TasksCollection.find(query, {
      sort: {
        order: 1,
        createdAt: -1,
      },
    });
  },
});

Template.App.events({
  'submit .task-form'(event) {
    event.preventDefault();

    const target = event.target;
    const text = target.text.value.trim();
    const category = target.category.value;

    if (!text) {
      return;
    }

    Meteor.call('tasks.insert', text, category);

    target.text.value = '';
    target.category.value = 'Work';
  },

  'click .filter-btn'(event, instance) {
    const category = event.target.getAttribute('data-category');
    instance.selectedCategory.set(category);
  },
});