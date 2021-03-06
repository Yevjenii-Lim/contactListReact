import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import s from "./list.module.css";

const ContactItem = (props) => {
  let [address, setAddress] = useState({});
  let [editMode, setEditMode] = useState(false);
  let [name, setName] = useState(props.name);
  let [disBtn, setDisBtn] = useState(false);

  useEffect(() => {
    setName(props.name);
  }, [props.name]);

  let getAddress = async () => {
    setDisBtn(true);
    let isEmpty = Object.keys(address).length;
    if (!!isEmpty) {
      props.openMore(props.id, props.showMore);
      setDisBtn(false);
    } else {
      let response = await axios.get(
        "http://localhost:5000/users/" + props.id
      );
      setAddress({ ...response.data.address });
      props.openMore(props.id, props.showMore);
      setDisBtn(false);
    }
  };
  let activateEditMode = () => {
    setEditMode(true);
  };
  let changeName = (value) => {
    setName(value);
  };
  let deactivateEditMode = async () => {
    let user = await fetch("http://localhost:5000/users/"+ props.id)
    user = await user.json()
    await fetch("http://localhost:5000/users/"+ props.id, {
      method: "PUT",
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify({...user, name: name})
    })
    setEditMode(false);
  };
  let openMoreClasses = s.more + " " + (props.showMore ? s.small : s.big);
  return (
    <>
      {props.alphabet && <div className={s.letter}>{props.alphabet} </div>}
      <li className={props.hide ? s.hide : " " + s.listItem}>
        <img
          className={s.avatar}
          src={`https://eu.ui-avatars.com/api/?name=${props.name}`}
          alt=""
        />
        {editMode ? (
          <input
            autoFocus={true}
            type="text"
            onBlur={deactivateEditMode}
            onChange={(e) => changeName(e.target.value)}
            value={name}
          />
        ) : (
          <p onDoubleClick={activateEditMode}>{name}</p>
        )}

        <p>
          <a href={`tel:+${props.number}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-phone-call"
            >
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          </a>
        </p>
        <button disabled={disBtn} onClick={() => getAddress()}>
          more
        </button>
      </li>
     {!props.showMore && <div className={openMoreClasses}>
        <span className={s.option}>City:</span>{" "}
        <span>{!address.city ? null : address.city}</span>
        <p>
          <span className={s.option}>Street:</span>{" "}
          <span>{!address.street ? null : address.street}</span>
        </p>
        <p>
          <span className={s.option}>Phone: </span>
          <span>{props.number}</span>
        </p>
        <button
          className={s.btnDelete}
          onClick={() => props.removeContact(props.id, props.name)}
        >
          delete
        </button>
      </div>} 
    </>
  );
};

export default ContactItem;
