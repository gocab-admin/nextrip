import React, { useState } from "react";
import dynamic from "next/dynamic";

import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { updateHost } from "@/redux/slice/host/hostSlice";
import { usePageContext } from "@/components/Providers/PageContext";

import styles from "./HostEditMode.module.scss";

const Textarea = dynamic(() => import("@/components/textArea"), {
  ssr: false
});
const MuiButton = dynamic(() => import("@/components/MuiButton"), {
  ssr: false
});

const HostEditMode = ({ show }: any) => {
  const { i18 } = usePageContext();
  const [text, setText] = useState<any>({
    school: "",
    pet: "",
    song: "",
    funFact: "",
    bio: "",
    language: "",
    work: "",
    obsessed: "",
    useLessSkill: "",
    hobby: "",
    desc: ""
  });
  const maxLength = show === "desc" ? 500 : 50;
  const handleChange = (event: any) => {
    const { value, name } = event.target;
    const formattedValue = value.replace(/[\r\n]/g, "");
    if (formattedValue.length <= maxLength) {
      setText((prevState: any) => ({
        ...prevState,
        [name]: formattedValue
      }));
    }
  };
  const handleSave = async () => {
    const userId: any = sessionStorage.getItem("UserId");
    const token: any = sessionStorage.getItem("appToken");
    let fcmId: any;
    const trimmedValue = text[show]?.trim();
    const exceededCharacterLimit = trimmedValue?.length > maxLength;
    if (exceededCharacterLimit) {
      alert(
        `${
          show.charAt(0).toUpperCase() + show.slice(1)
        } exceeds the character limit of ${maxLength}.`
      );
      return;
    }
    const data = {
      [show]: trimmedValue
    };

    const response: any = await dispatch(
      updateHost(userId, data, token, fcmId)
    );
    if (response) {
      dispatch(setModal("" as any));
      alert(
        `${show.charAt(0).toUpperCase() + show.slice(1)} added successfully.`
      );
    }
  };
  return (
    <div>
      {show === "school" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.WHEREIWENTTOSCHOOL?.TITLE || "Where did you go to school?"}
          </h3>
          <p className="item-description">
            {i18?.WHEREIWENTTOSCHOOL?.SUBTITLE ||
              "Whether it's home school, secondary school, or trade school, name the school that made you who you are."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.PROFILE?.WHEREIWENTTOSCHOOL || "Where I went to school" 
                }:`}
            </p>
            <Textarea
              className="input-field"
              name="school"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "hobby" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.ISPENDTOOMUCHTIME?.TITLE ||
              "What do you spend too much time doing?"}
          </h3>
          <p className="item-description">
            {i18?.ISPENDTOOMUCHTIME?.SUBTITLE ||
              "Share an activity or hobby you spend lots of free time on. Example: Watching cat videos or playing chess."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.PROFILE?.ISPENDTOOMUCHTIME || "I spend too much time" 
                }:`}
            </p>
            <Textarea
              className="input-field"
              name="hobby"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "pet" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>{i18?.PETS?.TITLE || "Do you have any pets in your life?"}</h3>
          <p className="item-description">
            {i18?.PETS?.SUBTITLE ||
              "Share any pets you have and their names. Example: My calico cat Whiskers or my speedy tortoise Leonardo."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>{`${i18?.ROOMPAGE?.PETS || "Pets"  }:`}</p>
            <Textarea
              className="input-field"
              name="pet"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}
      {show === "work" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>{i18?.MYWORK?.TITLE || "What do you do for work?"}</h3>
          <p className="item-description">
            {i18?.MYWORK?.SUBTITLE ||
              "Tell us what your profession is. If you don&apos;t have a traditional job, tell us your life&apos;s calling. Example: Nurse, parent to four kids, or retired surfer."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>{`${i18?.PROFILE?.MYWORK || "My work"  }:`}</p>
            <Textarea
              className="input-field"
              name="work"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "song" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.FAVOURITESONG?.TITLE ||
              "What was your favourite song in secondary school?"}
          </h3>
          <p className="item-description">
            {i18?.FAVOURITESONG?.SUBTITLE ||
              "However embarrassing, share the tune you listened to on repeat as a teenager."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.FAVOURITESONG?.MYFAVOURITESONG ||
                "My favourite song in secondary school"  }:`}
            </p>
            <Textarea
              className="input-field"
              name="song"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "obsessed" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.IAMOBSESSEDWITH?.TITLE || "What are you obsessed with?"}
          </h3>
          <p className="item-description">
            {i18?.IAMOBSESSEDWITH?.SUBTITLE ||
              "Share whatever you can't get enough of - in a good way. Example: Baking rosemary focaccia."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.IAMOBSESSEDWITH?.IMOBESSEDWITH || "I'm obsessed with" 
                }:`}
            </p>
            <Textarea
              className="input-field"
              name="obsessed"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "funFact" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>{i18?.MYFUNFACT?.TITLE || "What's a fun fact about you?"}</h3>
          <p className="item-description">
            {i18?.MYFUNFACT?.SUBTITLE ||
              "Share something unique or unexpected about you. Example: I was in a music video or I'm a juggler."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>{`${i18?.PROFILE?.MYFUNFACT || "My fun fact"  }:`}</p>
            <Textarea
              className="input-field"
              name="funFact"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "useLessSkill" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.WHATYOURMOSTUSELESSSKILL?.TITLE ||
              "What's your most useless skill?"}
          </h3>
          <p className="item-description">
            {i18?.WHATYOURMOSTUSELESSSKILL?.SUBTITLE ||
              "Share a surprising but pointless talent you have. Example: Shuffling cards with one hand."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.PROFILE?.MYMOSTUSELESSSKILL || "My most useless skill" 
                }:`}
            </p>
            <Textarea
              className="input-field"
              name="useLessSkill"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "bio" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>
            {i18?.MYBIOGRAPHYTITLE?.TITLE ||
              "What would your biography title be?"}
          </h3>
          <p className="item-description">
            {i18?.MYBIOGRAPHYTITLE?.SUBTITLE ||
              "If someone wrote a book about your life, what would they call it? Example: Born to Roam or Chronicles of a Dog Mum."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>
              {`${i18?.PROFILE?.MYBIOGRAPHYTITLEWOULDBE ||
                "My biography title would be"  }:`}
            </p>
            <Textarea
              className="input-field"
              name="bio"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}

      {show === "desc" && (
        <div className={`${styles.useredit_mode}`}>
          <h3>{i18?.PROFILE?.ABOUTYOU || "About you"}</h3>
          <p className="item-description">
            {i18?.ABOUTYOU?.SUBTITLE ||
              "Tell us a little bit about yourself so your future Hosts or guests can get to know you."}
          </p>
          <div className={`${styles.input_container}`}>
            <p>{i18?.PROFILE?.ADDINTRO || "Add intro:"}</p>
            <Textarea
              className="input-field"
              name="decs"
              onChange={handleChange}
            ></Textarea>
          </div>
          <div className={styles.character_count}>
            <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
          </div>
          <div className={`${styles.button_container}`}>
            <MuiButton
              label="Save"
              sx={{
                backgroundColor: "var(--footer-text-color) !important",
                borderRadius: "8px",
                padding: "5px 8px",
                color: "#ffffff",
                border: "2px solid var(--footer-text-color) !important",
                textTransform: "capitalize",
                marginTop: "24px"
              }}
              value={undefined}
              onClick={handleSave}
              placeholder=""
              endIcon={undefined}
              variant={undefined}
              disabled={undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HostEditMode;
