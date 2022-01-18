import React, { useState } from "react";
import { Link } from "react-router-dom";

// Import the `useParams()` hook
import { Redirect, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";

import SkillsList from "../components/SkillsList";
import SkillForm from "../components/SkillForm";
import "./Pages.css";
import Auth from "../utils/auth";

import { QUERY_ME } from "../utils/queries";
import { UPDATE_ABOUT, UPDATE_LOCATION,UPDATE_EMAIL, UPDATE_PHONE } from "../utils/mutations";





const Myprofile = () => {
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [updateMyAbout] = useMutation(UPDATE_ABOUT);
  const [updateMyLocation] = useMutation(UPDATE_LOCATION);
  const [updateMyPhone] = useMutation(UPDATE_PHONE);
  const [updateMyEmail] = useMutation(UPDATE_EMAIL);

  // Use `useParams()` to retrieve value of the route parameter `:profileId`
  const { profileId } = useParams();

  const { loading, data } = useQuery(QUERY_ME, {
    variables: { profileId: profileId },
  });

  // const profile = data?.profile || {};
  const profile = data?.me || data?.profile || {};
  // console.log(data?.me || data?.profile);
  //if not logged in
  if (!data?.me || data?.profile) {
    return (
      <h4>
        You need to be logged in to see your profile page.
        <br />
        <Link to="/login">Login Here!</Link> or{" "}
        <Link to="/signup">Signup Here!</Link>
      </h4>
    );
  }
  // console.log(data.me, "test");
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {

    
    
   await updateMyAbout({
        variables: { profileId : data.me._id, about },
      });

      setAbout("");
   
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormSubmit2 = async (event) => {
    event.preventDefault();
    try {

    
    
   await updateMyLocation({
        variables: { profileId : data.me._id,location },
      });

     
      setLocation("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormSubmit3 = async (event) => {
    event.preventDefault();
    try {

    
    
   await updateMyEmail({
        variables: { profileId : data.me._id,email },
      });

     
      setEmail("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleFormSubmit4 = async (event) => {
    event.preventDefault();
    try {

    
    
   await updateMyPhone({
        variables: { profileId : data.me._id,phone },
      });

     
      setPhone("");
    } catch (err) {
      console.error(err);
    }
  };
  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === profileId)
 
    return <Redirect to="/me:/profileId" />;

  if (loading) {
    return <div>Loading...</div>;
  }

  //   return (
  //     <h4>
  //       You need to be logged in to see your profile page. Use the navigation
  //       links above to sign up or log in!
  //     </h4>
  //   );
  // }


  return (
    <div>
      <h1>My Profile</h1>
      <div className="myInfo">
        <h3>About:</h3>

        <img src={`/images/${profile.img}`} alt="text" />

        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit}
        >
          <div className="col-12 col-lg-9">
          <p>Update About Section</p>
            <input
              placeholder= {profile.about}
              value={about}
              className="form-input w-100"
              onChange={(event) => setAbout(event.target.value)}
            />
          </div>
          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-inline py-3" type="submit">
              Update!
            </button>
          </div>
        </form>

        <h3>Location:</h3>
        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit2}
        >
          <div className="col-12 col-lg-9">
          <p> Update Location</p>
            <input
              placeholder= {profile.location}
              value={location}
              className="form-input w-100"
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-inline py-3" type="submit">
              Update!
            </button>
          </div>
        </form>
        <h3>Contact Info:</h3>
        <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit3}
        >
          <div className="col-12 col-lg-9">
          <p> Update Email</p>
            <input
              type= "email"
              placeholder= {profile.email}
              value={email}
              className="form-input w-100"
              onChange={(event) => setEmail(event.target.value)}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </div>
          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-inline py-3" type="submit">
              Update!
            </button>
          </div>
          </form>
          <form
          className="flex-row justify-center justify-space-between-md align-center"
          onSubmit={handleFormSubmit4}
        >
       
          <div className="col-12 col-lg-9">
          <p> Update Phone Number (###-###-####)</p>
            <input
              type= "tel"
              placeholder= {profile.phone}
              value={phone}
              className="form-input w-100"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>
          <div className="col-12 col-lg-3">
            <button className="btn btn-info btn-inline py-3" type="submit">
              Update!
            </button>
          </div>
        </form>
        <h3 className="card-header">Specializations and Skill Sets:</h3>

        {profile.skills?.length > 0 && <SkillsList skills={profile.skills} />}

        <div
          className="addSkill my-4 p-4"
          style={{
            border: "1px solid #1a1a1a",
            borderRadius: "5px",
            backgroundColor: "lightslategray",
          }}
        >
          <SkillForm profileId={profile._id} />
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
