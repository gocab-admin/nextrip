export interface Address {
    city: string;
    state: string;
    country: string;
    zipcode: string;
    address: string;
    landmark: string;
    coordinates: number[];
  }
  
  export interface Guest {
    adult: string;
    children: string;
    pets: string;
  }
  
  export interface BedRoomBedtype {
    bedRoom: string;
    bedType: string;
    bedCount: number;
    _id: string;
  }
  
  export interface BathRoom {
    bathRoomCount: number;
    shared: boolean;
  }
  
  export interface Accommodation {
    bathRoom: BathRoom;
    bedRoomCount: number;
    bedRoomBedtype: BedRoomBedtype[];
  }
  
  export interface Image {
    coverImage: string;
    groupImage: { imagePath: string; _id: string }[];
  }
  
  export interface AttachmentData {
    image: Image;
    rules: any[];
  }
  
  export interface BookingType {
    extraGuest: number;
    extraGuestFee: number;
    maximumNight: number;
    minimumNight: number;
  }
  
  export interface Pricing {
    baseFare: number;
    perDay: number;
    perHour: number;
  }
  
  export interface PriceData {
    blockedDates: any[];
    bookingType: BookingType;
    pricing: Pricing;
  }
  
  export interface Amenity {
    categoryId: string;
    name: string;
    desc: string;
    icon: string;
  }
  
  export interface AmenityCategory {
    _id: string;
    category: string;
    desc: string;
  }
  
  export interface ProviderData {
    firstname: string;
    _id: string;
    email: string;
    verifiedDate: string;
    profileImage: string;
  }
  
  export interface PropertyData {
    _id: string;
    address: Address;
    guest?: Guest;
    accommodation?: Accommodation;
    propertyName: string;
    propertyDesc: string;
    status: string;
    totalRatingCount?: number;
    totalReviewCount?: number;
    reviewRating?: any[];
    placesToOffer?: any[];
    attachmentData?: AttachmentData[];
    priceData: PriceData[];
    amenities?: Amenity[];
    amenityCategories?: AmenityCategory[];
    propertyTypeName: string;
    propertyCategoryName: string;
    providerData: ProviderData;
    cancellationPolicyId?: number;
  }
