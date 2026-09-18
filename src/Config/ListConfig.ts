const Pages = [
    { name: '/category-select/', settings: {} },
    { name: '/select-place/', settings: {} },
    { name: '/select-location/', settings: {} },
    { name: '/confirm-location/', settings: {} },
    { name: '/people-bed-count/', settings: {} },
    { name: '/bed-types/', settings: {} },
    { name: '/amenity/', settings: {} },
    { name: '/privileges/', settings: {} },
    { name: '/image-select/', settings: {} },
    { name: '/title/', settings: {} },
    { name: '/description/', settings: {} },
    { name: '/guest-price/', settings: {} },
    { name: '/review-property-listing/', settings: {} },
    { name: '/slot-availability/', settings: {} },
    { name: '/max-guest-count/', settings: {} },
    { name: '/cancellation-policy/', settings: {} },
    { name: '/rules/', settings: {} },
]

const Steps = [
    {
        "title": "Tell us about your place",
        "subTitle": "Share some basic info, such as where it is and how many guests can stay.",
        "description": "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay.",
        "icon": "",
        "image": "",
        "pages": [
            { name: '/category-select/', settings: {} },
            { name: '/select-place/', settings: {} },
            { name: '/select-location/', settings: {} },
            { name: '/confirm-location/', settings: {} },
            { name: '/people-bed-count/', settings: {} },
            { name: '/bed-types/', settings: {} }
        ]
    },
    {
        "title": "Make it stand out",
        "subTitle": "Add 1 or more photos plus a title and description - we'll help you out.",
        "description": "In this step, you'll add some of the amenities your place offers, plus 1 or more photos. Then you'll create a title and description.",
        "icon": "",
        "image": "",
        "pages": [
            { name: '/privileges/', settings: {} },
            { name: '/image-select/', settings: {} },
            { name: '/title/', settings: {} },
            { name: '/description/', settings: {} }
        ]
    },
    {
        "title": "Finish up and publish",
        "subTitle": "Set a starting price and publish your listing.",
        "description": "Finally, you'll choose if you'd like to start with an experienced guest, then you'll set your nightly price. Answer a few quick questions and publish when you're ready.",
        "icon": "",
        "image": "",
        "pages": [
            { name: '/guest-price/', settings: {} },
            { name: '/slot-availability/', settings: {} },
            // { name: '/cancellation-policy/', settings: {} },
            // { name: '/rules/', settings: {} }, 
            { name: '/review-property-listing/', settings: {} }
        ]
    }
]

export { Pages, Steps } 