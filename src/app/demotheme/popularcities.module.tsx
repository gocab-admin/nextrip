"use client"
import { url } from "inspector";
import styles from "./popularcities.module.css"
import { useState } from "react";

const PopularCities = () => {
  const cities = [
    { name: "New York", img: "https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_1.jpg" },
    { name: "Sydney", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_2.jpg" },
    { name: "Paris", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_3.jpg" },
    { name: "Barcelona", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_4.jpg" },
    { name: "Berlin", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_5.jpg" },
    { name: "Budapest", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_6.jpg" },
    { name: "Singapore", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_1627625434.jpg" },
    { name: "New Delhi", img: "	https://demowpthemes.com/buy2rental/public/front/images/starting_cities/starting_city_1627625602.jpg" },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
        <div className="container my-5 py-5">

          <h2 className="mb-4 ">Popular Cities</h2>
    
          {/* for cities */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {cities.map((city, index) => (
              <div key={index} className="col">
                <div className="d-flex align-items-center p-3 rounded">
                  <img
                    src={city.img}
                    alt={city.name}
                    className="rounded img-fluid"
                    style={{
                      width: "100px",
                      height: "100px",
                    //   objectFit: "cover",
                    }}
                  />
                  
                  <h6
                    style={{
                      color: isHovered ? "red" : "black", 
                      cursor: "pointer", 
                      transition: "color 0.3s", 
                    }}

                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} 
                    className = "ms-3 mb-0 text-15 font-weight-600"
                  >
                    {city.name}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
      {/* <section  className="hero-section bg-light"> */}
      {/* <div className="container py-5"> */}
      <div style= {{backgroundImage: 'url(https://demowpthemes.com/buy2rental/public/front/images/logos/1635917422_try_hosting_img.jpg)', width: '100%', height: '100%',borderRadius: '5%'}} className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"  >
                <div style={{color: 'white', paddingLeft: '10%', marginBottom: '120px', paddingTop: '10%'}} className="col-md-12">
                     <h2 className="font-weight-600 mb-2">Try Hosting</h2>
                     <p className="text-20">Earn money sharing <br />your extra space with travelers</p>
                     <a href="https://demowpthemes.com/buy2rental/become-host"><button className="btn btn-light p-3 rounded-4 border-0 font-weight-500 mt-5">Get Started</button></a>
                </div>
            </div>


        {/* <div style={{backgroundImage:'url(https://demowpthemes.com/buy2rental/public/front/images/logos/1635917422_try_hosting_img.jpg)'}} className="row align-items-center">
          <div className="col-md-12">
            <div className="p-4 bg-dark text-white rounded">
              <h2 className="mb-3">Try Hosting</h2>
              <p>Earn money sharing your extra space with travelers</p>
              <button className="btn btn-light">Get Started</button>
            </div>
          </div>
          
        </div> */}
      {/* </div> */}
    {/* </section> */}

    {/* <div className="row tryhosting" style= {{backgroundImage: 'https://demowpthemes.com/buy2rental/public/front/images/logos/1635917422_try_hosting_img.jpg'}} >
                <div className="col-md-12">
                     <h2 className="font-weight-600 mb-2">Try Hosting</h2>
                     <p className="text-20">Earn money sharing <br />your extra space with travelers</p>
                     <a href="https://demowpthemes.com/buy2rental/become-host"><button className="p-3 rounded-4 border-0 font-weight-500 mt-5">Get Started</button></a>
                </div>
            </div> */}
    </>
      );
};

export default PopularCities;