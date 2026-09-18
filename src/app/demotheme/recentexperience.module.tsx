"use client"
const RecentExperience = () => {
  const experiences = [
    {
      city: "JAIPUR",
      title: "Hot Air Balloon Safari",
      people: "3 People",
      duration: "3 Hours",
      price: "$ 70",
      rating: "0",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
    {
      city: "AYYAMPUZHA",
      title: "Adventure Trip in Kerala",
      people: "5 People",
      duration: "2 Days 1 Night",
      price: "Packages",
      rating: "0",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
    {
      city: "BANDOLI",
      title: "Sight Seeing in Goa",
      people: "3 People",
      duration: "2 Days 1 Night",
      price: "$ 50",
      rating: "0",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
    {
      city: "ENGLAND",
      title: "Boat Tour in London",
      people: "4 People",
      duration: "4 Hours",
      price: "$ 80",
      rating: "0",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
    {
      city: "KUMILY",
      title: "Trekking in Thekkady",
      people: "5 People",
      duration: "2 Days 1 Night",
      price: "Packages",
      rating: "1",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
    {
      city: "BENGALURU",
      title: "Adventure Microlight Flying",
      people: "2 People",
      duration: "2 Hours",
      price: "$ 25",
      rating: "0",
      img: "https://demowpthemes.com/buy2rental/public/images/property/60/1670411765_paragliding.jpg",
    },
  ];

  return (
    <div className="container my-5">
      {/* Header */}
      <h2 className="text-center mb-4">Recent Experience</h2>

      {/* Experience List */}
      <div className="row row-cols-1 row-cols-lg-2 g-4">
        {experiences.map((experience, index) => (
          <div key={index} className="col">
            <div className="d-flex align-items-start border rounded p-3">
              {/* Image */}
              <img
                src={experience.img}
                alt={experience.title}
                className="img-fluid rounded"
                style={{
                  width: "150px",
                  height: "100px",
                  objectFit: "cover",
                }}
              />

              {/* Content */}
              <div className="ms-3">
                <h6 className="text-uppercase text-muted mb-1">{experience.city}</h6>
                <h5 className="mb-2">{experience.title}</h5>
                <p className="mb-1 small text-muted">
                  {experience.people} &bull; {experience.duration}
                </p>
                <p
                  className={`fw-bold mb-1 ${
                    experience.price === "Packages" ? "text-danger" : "text-dark"
                  }`}
                >
                  {experience.price}
                </p>
                <p className="small text-warning mb-0">
                  {/* ⭐ {experience.rating} ({experience.rating > 0 ? experience.rating : 0}) */}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperience;