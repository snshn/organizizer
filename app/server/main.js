import { Meteor } from 'meteor/meteor';

var Tasks = new Mongo.Collection('tasks');

Meteor.startup(() => {
  // code to run on server at startup
});
