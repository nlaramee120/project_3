const { Profile} = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');


const resolvers = {
  Query: {
    profile: async (parent, args, context) => {
      if (context.profile) {
        const profile = await Profile.findById(context.profileId).populate({
          // path: 'orders.products',
          // populate: 'category'
        });
        return profile;
      }
        throw new AuthenticationError('Not logged in');
      }
    },

  //   profile: async (parent, { profileId }) => {
  //     return Profile.findOne({ _id: profileId });
  //   },
  // },

  Mutation: {
    addProfile:  async (parent, args) => {
      const profile = await Profile.create(args);
      const token = signToken(profile);

      return { token, profile };
    },
    addSkill: async (parent, { profileId, skill }) => {
      return Profile.findOneAndUpdate(
        { _id: profileId },
        {
          $addToSet: { skills: skill },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    },
    removeProfile: async (parent, { profileId }) => {
      return Profile.findOneAndDelete({ _id: profileId });
    },
    updateProfile: async (parent, args, context) => {
      if (context.profile) {
        return await Profile.findByIdAndUpdate(context.profileId, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },

    removeSkill: async (parent, { profileId, skill }) => {
      return Profile.findOneAndUpdate(
        { _id: profileId },
        { $pull: { skills: skill } },
        { new: true }
      );
    },

    login: async (parent, { email, password }) => {
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(profile);

      return { token, profile };
    },
  },
};

// const resolvers = {
//   Query: {
//     tech: async () => {
//       return Tech.find({});
//     },
//     matchups: async (parent, { _id }) => {
//       const params = _id ? { _id } : {};
//       return Matchup.find(params);
//     },
//   },
//   Mutation: {
//     createMatchup: async (parent, args) => {
//       const matchup = await Matchup.create(args);
//       return matchup;
//     },
//     createVote: async (parent, { _id, techNum }) => {
//       const vote = await Matchup.findOneAndUpdate(
//         { _id },
//         { $inc: { [`tech${techNum}_votes`]: 1 } },
//         { new: true }
//       );
//       return vote;
//     },
//   },
// };

module.exports = resolvers;



// const resolvers = {
//   Query: {
//     tech: async () => {
//       return Tech.find({});
//     },
//     matchups: async (parent, { _id }) => {
//       const params = _id ? { _id } : {};
//       return Matchup.find(params);
//     },
//   },
//   Mutation: {
//     createMatchup: async (parent, args) => {
//       const matchup = await Matchup.create(args);
//       return matchup;
//     },
//     createVote: async (parent, { _id, techNum }) => {
//       const vote = await Matchup.findOneAndUpdate(
//         { _id },
//         { $inc: { [`tech${techNum}_votes`]: 1 } },
//         { new: true }
//       );
//       return vote;
//     },
//   },
// };

// module.exports = resolvers;
