import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import { dispatch } from "@/redux/store";
import { setModal } from "@/redux/slice/modalSlice";
import { updateUser } from "@/redux/slice/user/userSlice";
import { getApiMethod } from "@/services/global";
import { fetchUserAboutData } from "@/redux/slice/user/userAboutDataSlice";
import { addAlert } from "@/redux/slice/AlertSlice";
import APICONSTANT from "@/services/config";
import { usePageContext } from "@/components/Providers/PageContext";
import languages from "@/services/languages";

import styles from "./UserEditMode.module.scss";

const DynamicButtonComponent = dynamic(
  () => import("@/components/DynamicComponent/ButtonComponent")
);
const Textarea = dynamic(() => import("@/components/textArea"));
const Checkbox = dynamic(() => import("@mui/material/Checkbox"), {
  ssr: false
});
const FormControlLabel = dynamic(
  () => import("@mui/material/FormControlLabel"),
  { ssr: false }
);
const TextField = dynamic(() => import("@mui/material/TextField"), {
  ssr: false
});
const minChar = 0;
const UserEditMode = ({ show }: any) => {
  const { i18 } = usePageContext();
  const userData = useSelector(
    (state: any) => state.about.aboutData?.data?.userDetail
  );
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [Language, setLanguage] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [value, setValue] = React.useState(userData?.language || "");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

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
  // const [notify, setNotify] = useState({
  //   isOpen: false,
  //   message: "",
  //   type: "",
  //   severity: "",
  // });
  const maxLength = show === "desc" ? 50 : 50;
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
  const userId: any = localStorage.getItem("appUserId");
  const handleSave = async () => {
    const token: any = localStorage.getItem("appToken");
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

    const response = await dispatch(updateUser(userId, data));
    if (response.statusCode === 200) {
      dispatch(
        addAlert({
          isOpen: true,
          message: response.message,
          type: "success",
          severity: "success"
        })
      );
      dispatch(setModal("" as any));
      dispatch(fetchUserAboutData());
    }
  };

  const filteredLanguages = useMemo(()=>{
    if(Array.isArray(languages)) {
      if(search) {
        let smSearch = search.toLowerCase();
        return languages?.filter((item: any) => item.name.toLowerCase().includes(smSearch))
      }
      return languages;
    }
    return [];
  },[search, languages])

  // const fetchData = async () => {
  //   try {
  //     let url = APICONSTANT.language;

  //     const res: any = await getApiMethod(url);
  //     if (res.statusCode === 200) {
  //       const filteredValue = search
  //         ? res.data.language?.filter((item: any) => item.name === search)
  //         : res.data.language;
  //       setLanguage(filteredValue);
  //       setTotalCount(res.data.totalCount);
  //       // dispatch(addAlert({
  //       //   isOpen: true,
  //       //   message: res.message,
  //       //   type: "error",
  //       //   severity: "error",
  //       // }))
  //     } else {
  //       console.error();
  //     }
  //   } catch (err: any) {
  //     console.error();
  //   }
  // };
  // useEffect(() => {
  //   if (show === "language") {
  //     fetchData();
  //   }
  // }, [search, page, rowsPerPage]);
  useEffect(() => {
    setText({
      school: userData.school,
      pet: userData.pet,
      song: userData.song,
      funFact: userData.funFact,
      bio: userData.bio,
      language: userData.language,
      work: userData.work,
      obsessed: userData.obsessed,
      useLessSkill: userData.useLessSkill,
      hobby: userData.hobby,
      desc: userData.desc
    });
  }, [userData]);
  const updateCheckedValues = userData?.language?userData.language.split(","):[];
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage + 1);
  };
  const handleChangeRowsPerPage = (event: any) => {
    setPage(1);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  useEffect(() => {
    if (updateCheckedValues) {
      setCheckedValues(updateCheckedValues);
    }
  }, []);

  const handleChangeCheck = (event: any) => {
    setValue((event.target as HTMLInputElement).value);
    const { checked, value } = event.target;

    if (checked) {
      setSelectedValues((prev: any) => [...prev, value]);
    } else {
      setSelectedValues((prev: any) => prev.filter((v: any) => v !== value));
    }
    setCheckedValues((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
  };

  const handleSaveLang = async () => {
    try {
      const langs = languages.map((item)=>item.name);
      const validValues = checkedValues.filter(value => value.trim() !== "" && langs.includes(value));
      const data = {
        language: validValues.join(",")
      };

      const response = await dispatch(updateUser(userId, data));
      if (response.statusCode === 200) {
        dispatch(
          addAlert({
            isOpen: true,
            message: response.message,
            type: "success",
            severity: "success"
          })
        );
        dispatch(setModal("" as any));
        dispatch(fetchUserAboutData());
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    dispatch(fetchUserAboutData());
  }, []);
  return (
    <div>
      {show === "school" && (
        <>
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
                {`${i18?.PROFILE?.WHEREIWENTTOSCHOOL ||
                  "Where I went to school"  }:`}
              </p>
              <Textarea
                className="input-field"
                name="school"
                onChange={handleChange}
                defaultValue={userData?.school}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.school ? text.school.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            {/* <MuiButton
                label={i18?.ROOMPAGE?.SAVE || "Save"}
                sx={{
                  backgroundColor: '#222222 !important', borderRadius: '8px', color: '#ffffff', border: '2px solid #222222 !important', textTransform: 'capitalize',
                }}
                onClick={handleSave}
              /> */}

            <DynamicButtonComponent
              variant="outlined"
              disabled={text.school.length>minChar?false:true}
              className={text.school.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "hobby" && (
        <>
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
                defaultValue={userData?.hobby}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.hobby ? text.hobby.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.hobby.length>minChar?false:true}
              className={text.hobby.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "pet" && (
        <>
          <div className={`${styles.useredit_mode}`}>
            <h3>{i18?.PETS?.TITLE || "Do you have any pets in your life?"}</h3>
            <p className="item-description">
              {i18?.PETS?.SUBTITLE ||
                "Share any pets you have and their names. Example: My calico cat Whiskers or my speedy tortoise Leonardo."}
            </p>
            <div className={`${styles.input_container}`}>
              <p>{`${i18?.SELECTBASICS?.PETS || "Pets"  }:`}</p>
              <Textarea
                className="input-field"
                name="pet"
                onChange={handleChange}
                defaultValue={userData?.pet}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.pet ? text.pet.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.pet.length>minChar?false:true}
              className={text.pet.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}
      {show === "work" && (
        <>
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
                defaultValue={userData?.work}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.work ? text.work.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.work.length>minChar?false:true}
              className={text.work.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "song" && (
        <>
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
                defaultValue={userData?.song}
                onChange={handleChange}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.song ? text.song.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.song.length>minChar?false:true}
              className={text.song.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "obsessed" && (
        <>
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
                defaultValue={userData?.obsessed}
                onChange={handleChange}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${
                text.obsessed ? text.obsessed.length : 0
              }/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.obsessed.length>minChar ? false : true}
              className={text.obsessed.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "funFact" && (
        <>
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
                defaultValue={userData?.funFact}
                onChange={handleChange}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.funFact ? text.funFact.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.funFact.length>minChar ? false : true}
              className={text.funFact.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "useLessSkill" && (
        <>
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
                defaultValue={userData?.useLessSkill}
                onChange={handleChange}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${
                text.useLessSkill ? text.useLessSkill.length : 0
              }/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.useLessSkill.length>minChar ? false : true}
              className={text.useLessSkill.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}

      {show === "bio" && (
        <>
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
                defaultValue={userData?.bio}
                onChange={handleChange}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.bio ? text.bio.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.bio.length>minChar ? false : true}
              className={text.bio.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}
      {show === "language" && (
        <>
          <div className={`${styles.useredit_mode}`}>
            <div>
              <div>
              <div className="mb-4">
                <h3>
                  {i18?.PROFILE?.LANGUAGEYOUSPEAK || "Language you speak"}
                </h3>
              </div>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                placeholder={
                  i18?.PROFILE?.SEARCHFORALANGUAGE || "Search for a language"
                }
                onChange={(e) => setSearch(e.target.value)}
                // className="border border-black w-full rounded-full py-2 px-3 pr-10 "
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "30px",
                    borderColor: "black"
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "black" // Set the outline (focused) border color to black
                  }
                }}
              />
              </div>
              <div className="pt-3">
                {/* {LanguageChecked} */}

                {filteredLanguages.map((langData: any, index: number) => (
                  <>
                    <div key={langData?.name}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id={langData?.name}
                            value={langData?.name}
                            sx={{
                              color: "#717171",
                              "&.Mui-checked": {
                                color: "black"
                              }
                            }}
                          />
                        }
                        label={langData?.name}
                        sx={{ flexDirection: "row" }}
                        value={langData?.name}
                        checked={checkedValues.includes(langData?.name)}
                        onChange={handleChangeCheck}
                      />
                    </div>
                    <hr />
                  </>
                ))}
              </div>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            {/* <div className={`${styles.pagination}`}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={totalCount || 0}
                  rowsPerPage={rowsPerPage}
                  page={page - 1}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div> */}
            <DynamicButtonComponent
              variant="outlined"
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              disabled={checkedValues.length>0 ? false : true}
              className={checkedValues.length>0?'':styles.disabledButton}
              onClick={handleSaveLang}
              borderRadius="8px"
            />
          </div>
        </>
      )}
      {show === "desc" && (
        <>
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
                name="desc"
                onChange={handleChange}
                defaultValue={userData?.desc}
              ></Textarea>
            </div>
            <div className={styles.character_count}>
              <p>{`${text.desc ? text.desc.length : 0}/${maxLength}`}</p>
            </div>
          </div>
          <div className={`${styles.button_container} border-top`}>
            <DynamicButtonComponent
              variant="outlined"
              disabled={text.desc.length>minChar ? false : true}
              className={text.desc.length>minChar?'':styles.disabledButton}
              text={i18?.ROOMPAGE?.SAVE || "Save"}
              onClick={handleSave}
              borderRadius="8px"
            />
          </div>
        </>
      )}
      {/* <AlertComponent notify={notify} setNotify={setNotify} /> */}
    </div>
  );
};

export default UserEditMode;
