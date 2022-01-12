import React from "react";
import { Link } from "react-router-dom";

// Import the `useParams()` hook
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import SkillsList from "../components/SkillsList";
import "./Pages.css";

import { QUERY_SINGLE_PROFILE } from "../utils/queries";

const Profile = () => {
  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { profileId } = useParams();

  const { loading, data } = useQuery(QUERY_SINGLE_PROFILE, {
    // pass URL parameter
    variables: { profileId: profileId },
  });

  const profile = data?.profile || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p class="payText">Have services been completed?</p>

      <Link to="/pay">
        <button
          type="button"
          class="payMech btn btn-info"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Pay {profile.firstName} {profile.lastName}
        </button>
      </Link>

      <h2>
        About {profile.firstName} {profile.lastName}:
      </h2>
      <p>
        {profile.about} "Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum."
      </p>
      <h2>Location:</h2>
      <p>{profile.location} Chicago</p>
      <h2>Contact</h2>
      <p>{profile.email} test@gmail.com</p>
      <h2 className="card-header">Specializations and Skill Sets</h2>

      {profile.skills?.length > 0 && <SkillsList skills={profile.skills} />}
    </div>
  );
};

export default Profile;
