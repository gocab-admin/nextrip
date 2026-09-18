import React, { useMemo, useState } from "react";
import styles from './hero.module.scss';
import { BiSearch } from "react-icons/bi";
import { yellowTheme } from "@/components/colorVariable";
import ImageComponent from "../../components/ImageComponent";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@react-google-maps/api";
import LoadMap from "../../components/LoadMap";
import { usePageContext } from "@/components/Providers/PageContext";
const libraries: any = ["places"];

function Hero({themeData, categoryName}:any) {
  const router = useRouter();
  const [query, setQuery] = useState({
    lat: 34.0549076,
    lng: -118.242643,
    location: ""
  });
  const [autocomplete, setautocomplete] = useState<any>(null);
  const [isLoaded, setLoaded] = useState(false);
  const { settings, baseUrl, responsiveView } = usePageContext();
  const { google } = settings;
  const APIKEY = google?.mapApiKey;

  const herodata = useMemo(()=>{
    if(Array.isArray(themeData?.images))
   return themeData?.images.map((item:any)=>(item.imagePath));
  return [];
  },[themeData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery((prev)=>({...prev, location: value}));
  };

  const onLoad = (autocomplete: any) => {
    setautocomplete(autocomplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null && autocomplete.getPlace) {
      const placeDetail = autocomplete.getPlace();
      const lat = placeDetail.geometry?.location.lat();
      const lng = placeDetail.geometry?.location.lng();
      
      const pat1 = /^\d{6}$/;
      const location = placeDetail.formatted_address;
      setQuery({
        lat,
        lng,
        location
      })
    }
  };

  const handleSearch = () => {
    console.log(`Searching for: ${query}`); // Replace with actual search functionality
    if(query.location && categoryName) {
      router.push(`/${categoryName}?lat=${query.lat}&lng=${query.lng}&location=${query.location}`);
    }
  };
  const onloadmap = () => {
    setLoaded(true);
  };

  return (
    <div className="row mt-4">
      {APIKEY && (
            <LoadMap
              libraries={libraries}
              googleMapsApiKey={APIKEY}
              onloadmap={onloadmap}
            />
          )}
      {/* Left Column */}
      <div className={`col-lg-6 ${styles.heroleft}`}>
        {/* Location Selection */}
        {/* <button className={`${styles.locationbtn} mt-4`}>
          <img src={"/fitnest/near_me.svg"} alt="Location Icon" />
          <span>{heroname?.title}</span>
        </button> */}
        <div className={`${styles.location} mt-4`}>
          <div className={`${styles.locationbtn} me-3`}>
          <img src={"/fitnest/near_me.svg"} alt="Location Icon" />
            {/* <span></span> */}
           {isLoaded&& <Autocomplete
                      onLoad={onLoad}
                      onPlaceChanged={onPlaceChanged}
                      options={{}}
                    >
            <input
              type="text"
              value={query.location}
              onChange={handleInputChange}
              placeholder="Los Angeles"
              className={styles.searchInput}
            />
            </Autocomplete>}
            {responsiveView === "sm" || responsiveView === "xs" &&
            <button>
            <BiSearch
                          style={{
                            backgroundColor: yellowTheme.primaryColor,
                            color: yellowTheme.secondaryColor,
                          }}
                        />
                        </button>}
          </div>
          {!(responsiveView === "sm" || responsiveView === "xs") && <button
            onClick={handleSearch}
            className={styles.searchButton}
            disabled={!query}
          >
            Search
          </button>}
        </div>

        {/* Content Title and Subtitle */}
        <div className={`${styles.contentTitle} mt-4`}>{themeData?.title}</div>
        {/* <div className={`${styles.contentTitle} mb-2`}>
        {heroname?.title}
        </div> */}
        <p className={styles.contentDescription}>
          {themeData?.description}
        </p>
      </div>

      {/* Right Column - Gallery */}
      {herodata.length===0  ?
        <div className={`col-lg-6 ${styles.heroright}`}>
        <div className={styles.imgContainer}>
          <ImageComponent
            src={'/images/placeholder-sq.jpg'}
            alt="Image 1"
            height={170}
            width={0}
            layout="intrinsic"
            style={{height: '170px'}}
            className={`${styles.image1} ${styles.fitImage}`}
          />
          <div className={`${styles.image2}`}>
            <ImageComponent
              src={'/images/placeholder-sq.jpg'}
              alt="Image 2"
              width={170}
            height={0}
            layout="intrinsic"
              className={`${styles.fitImage}`}
            />
          </div>
          <div className={`${styles.image3}`}>
            <ImageComponent
              src={'/images/placeholder-sq.jpg'}
              alt="Image 3"
              width={170}
            height={0}
            layout="intrinsic"
              className={`${styles.fitImage}`}
            />
          </div>
        </div>
      </div>
      :<div className={`col-lg-6 ${styles.heroright}`}>
        <div className={styles.imgContainer}>
          <ImageComponent
            src={ herodata[0]}
            alt="Image 1"
            width={170}
            height={0}
            layout="intrinsic"
            className={`${styles.image1} ${styles.fitImage}`}
          />
          <div className={`${styles.image2}`}>
            <ImageComponent
              src={ herodata[1]}
              alt="Image 2"
              width={170}
            height={0}
            layout="intrinsic"
              className={`${styles.fitImage}`}
            />
          </div>
          <div className={`${styles.image3}`}>
            <ImageComponent
              src={ herodata[2]}
              alt="Image 3"
              width={170}
            height={0}
            layout="intrinsic"
              className={`${styles.fitImage}`}
            />
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Hero;
