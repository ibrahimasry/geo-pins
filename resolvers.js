const {AuthenticationError, PubSub} = require("apollo-server");
const Pin = require("./models/Pin");
const Comment = require("./models/Comment");

const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";
const pubsub = new PubSub();
const authenticatedMiddleWare =
  (next) =>
  (root, arg, {user}) => {
    if (user) return next(root, arg, {user});
    else throw new AuthenticationError("must authenticate");
  };
module.exports = {
  Query: {
    me: authenticatedMiddleWare((root, arg, {user}) => user),
    getPins: authenticatedMiddleWare(async (root, arg, {user}) => {
      const pins = await Pin.find({image: {$exists: true}}).populate({
        path: "comments",
        options: {
          sort: {createdAt: -1},
          limit: 5,
        },
      });
      return pins;
    }),
  },

  Mutation: {
    createPin: authenticatedMiddleWare(async (root, arg, ctx) => {
      let pin = new Pin({...arg.input, author: ctx.user._id});
      let pinAdded = await pin.save();
      pubsub.publish(PIN_ADDED, {pinAdded});
      return pinAdded;
    }),

    createComment: authenticatedMiddleWare(
      async (root, {pinId, text}, {user}) => {
        let comment = await new Comment({
          text,
          author: user._id,
          pin: pinId,
        }).save();

        let pinUpdated = await Comment.populate(comment, "author");
        pubsub.publish(PIN_UPDATED, {pinUpdated});

        return pinUpdated;
      }
    ),

    deletePin: authenticatedMiddleWare(async (root, {_id}, {user}) => {
      let pin = await Pin.findOne({_id});
      if (pin.author._id.toString() !== user._id.toString())
        throw new AuthenticationError("cheating huh !");
      let pinDeleted = await Pin.findOneAndDelete({_id}).exec();
      pubsub.publish(PIN_DELETED, {pinDeleted});

      return pinDeleted;
    }),
  },

  Subscription: {
    pinAdded: {
      subscribe: () => {
        return pubsub.asyncIterator(PIN_ADDED);
      },
    },
    pinDeleted: {
      subscribe: () => {
        return pubsub.asyncIterator(PIN_DELETED);
      },
    },
    pinUpdated: {
      subscribe: () => {
        return pubsub.asyncIterator(PIN_UPDATED);
      },
    },
  },
};
