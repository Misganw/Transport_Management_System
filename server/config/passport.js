import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";

// Serialize & deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Helper function to handle dynamic social login
// passport.js
// ...
const handleSocialLogin = async (profile, providerName, done) => {
  console.log("Google profile:", profile);
  // console.log("Access token:", accessToken);
  // handleSocialLogin(profile, "google", done);
  try {
    const email =
      profile.emails?.[0]?.value || `${providerId}@github.com` || null;
    const providerId = profile.id;

    let user = await userModel.findOne({
      "providers.providerId": providerId,
    });

    if (!user) {
      user = await userModel.findOne({ email });

      const providerObj = {
        providerName,
        providerId,
        name: profile.displayName || "",
        email,
        profilePhoto: profile.photos?.[0]?.value || "",
      };

      if (user) {
        // Add new provider to existing user
        user.providers.push(providerObj);
        // Consider updating other fields if they're missing, e.g., profileImage
        await user.save();
      } else {
        // Create new user with social provider
        user = await userModel.create({
          name: profile.displayName || "",
          email,
          providers: [providerObj],
          isVerified: true, // <--- Set to true for social logins if they are considered verified
          // Add any other default fields needed for a new user
        });
      }
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
};
// ...

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("Google OAuth profile:", profile);
      // console.log("Access token:", accessToken);
      handleSocialLogin(profile, "google", done);
    }
  )
);

// Facebook Strategy
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       profileFields: ["id", "displayName", "emails", "photos"],
//     },
//     (accessToken, refreshToken, profile, done) => {
//       handleSocialLogin(profile, "facebook", done);
//     }
//   )
// );

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/github/callback",
      scope: ["user:email"],
    },
    (accessToken, refreshToken, profile, done) => {
      handleSocialLogin(profile, "github", done);
    }
  )
);

export default passport;
