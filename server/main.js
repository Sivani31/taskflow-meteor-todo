import { Meteor } from 'meteor/meteor';

import { TasksCollection } from '../imports/api/TasksCollection.js';

Meteor.publish('tasks', function publishTasks() {
  return TasksCollection.find({}, {
    sort: {
      order: 1,
      createdAt: -1,
    },
  });
});

Meteor.methods({
  async 'tasks.insert'(text, category) {
    if (!text || !category) {
      throw new Meteor.Error('invalid-task', 'Task text and category are required');
    }

    const totalTasks = await TasksCollection.find().countAsync();

    return TasksCollection.insertAsync({
      text,
      category,
      checked: false,
      createdAt: new Date(),
      order: totalTasks,
    });
  },

  async 'tasks.remove'(taskId) {
    return TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setChecked'(taskId, checked) {
    return TasksCollection.updateAsync(taskId, {
      $set: {
        checked,
      },
    });
  },

  async 'tasks.updateOrder'(taskId, order) {
    return TasksCollection.updateAsync(taskId, {
      $set: {
        order,
      },
    });
  },
});