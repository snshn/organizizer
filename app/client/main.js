import { Template } from 'meteor/templating';
//import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

var Tasks = new Mongo.Collection('tasks');

function cancelDragging () {
    Session.set('dragging', null);
    $('body').removeClass('dragging');
}

function notWithinTheSameColumn(draggingId, targetId) {
    var targetTask = Tasks.findOne(targetId);

    if (targetTask.parent)
        if (targetTask.parent == draggingId)
            return true;
        else
            return notWithinTheSameColumn(draggingId, targetTask.parent);
    else
        return false;
}

Template.box.helpers({
    tasks() {
        return Tasks.find({ parent: this._id });
    }
});

Template.box.events({
    'click div'(event, instance) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (!Session.get('dragging')) {
            Session.set('dragging', this._id);
            $('body').addClass('dragging');
        } else {
            if (Session.get('dragging') != this._id) {
                if (!notWithinTheSameColumn(Session.get('dragging'), this._id)) {
                    Tasks.update(Session.get('dragging'), { $set: { parent: this._id } });
                }
            }
            cancelDragging();
        }
    },
    'click .v'(event, instance) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        Tasks.update(this._id, { $set: { done: this.done ? null : new Date() } });
    },
    'click h1 span'(event, instance) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (newName = prompt('New name', this.name))
          Tasks.update(this._id, { $set: { name: newName } });
    },
    'click .x'(event, instance) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (confirm('Really???'))
          Tasks.remove(this._id);
    }
});

Template.box_new.events({
    'click form'(event, instance) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (Session.get('dragging') && !this._id) {
            Tasks.update(Session.get('dragging'), { $set: { parent: null } });
            cancelDragging();
        }
    },
    'submit form'(event, instance) {
        event.preventDefault();
        var form = event.currentTarget;
        Tasks.insert({ added: new Date(), name: form.name.value.trim(), parent: this._id });
        form.reset();
        $(form.name).blur();
    }
});

/*
Meteor.startup(function () {
    $(function(){
        $(window).load(function(){
            var $gal   = $("body"),
                galW   = $gal.parent().outerWidth(true),
                galSW  = $gal[0].scrollWidth,
                wDiff  = (galSW/galW)-1,  // widths difference ratio
                mPadd  = 60,  // Mousemove Padding
                damp   = 20,  // Mousemove response softness
                mX     = 0,   // Real mouse position
                mX2    = 0,   // Modified mouse position
                posX   = 0,
                mmAA   = galW-(mPadd*2), // The mousemove available area
                mmAAr  = galW/mmAA;    // get available mousemove fidderence ratio

            $gal.mousemove(function(e) {
                mX = e.pageX - $(this).parent().offset().left - this.offsetLeft;
                mX2 = Math.min( Math.max(0, mX-mPadd), mmAA ) * mmAAr;
            });

            setInterval(function(){
                posX += (mX2 - posX) / damp; // zeno's paradox equation "catching delay"    
                $gal.scrollLeft(posX*wDiff);
            }, 10);
        });
    });
});
*/
