"use client"

import styles from "./carousel.module.scss";


export default function Carousel(){
    return(
        <>
            <div className="carouselbanner">

            <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://demowpthemes.com/buy2rental/public/front/images/banners/banner_1688126108.jpg"
            className="d-block w-100"
            alt="First Slide"
          />
          <div className="carousel-caption d-none d-md-block">
            <h2 className={styles.bannerTitle} >Book Top Hill Tent</h2>
            <h4 className={styles.bannerTitle} >Experiences Local things to do, wherever you are.</h4>
            <div className={styles.flexible} >
            <button style={{borderRadius: '30%', backgroundColor: '#ED3615', border: 'none'}} type="button" className="btn btn-primary"><a className="text-light" href="">I'm flexible</a></button>
            </div>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="https://demowpthemes.com/buy2rental/public/front/images/banners/banner_1688126126.jpg"
            className="d-block w-100"
            alt="Second Slide"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5 className={styles.bannerTitle} >Get your Rental Home</h5>
            <p className={styles.bannerTitle} >Website packages of worldwide.</p>
            <div className={styles.flexible} >
            <button style={{borderRadius: '30%', backgroundColor: '#ED3615', border: 'none'}} type="button" className="btn btn-primary">I'm flexible</button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
            </div>
        
        </>
    )
}