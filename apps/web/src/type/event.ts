export interface IEvent {
    name: string;
    slug: string;
    desc: string;
    image: string;
    price: number;
    amount: number;
    locationId: number;
    categoryId: number;
    startDate: string;
    endDate: string;
    user: any;
    category: any;
    location: any;
}

export interface IEventSlug {
    name: string;
    slug: string;
    desc: string;
    image: string;
    price: number;
    amount: number;
    locationId: number;
    categoryId: number;
    startDate: string;
    endDate: string;
    category: any;
    location: any;
}

export interface EventPost {
    name: string;
    slug: string;
    desc: string;
    image: File | string;
    price: number;
    amount: number;
    locationId: number;
    categoryId: number;
    startDate: string;
    endDate: string;
}

export interface FormEventCreate {
    name: string;
    slug: string;
    desc: string;
    image: any;
    price: number;
    amount: number;
    locationId: number;
    categoryId: number;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export interface CategoryLocationFetch {
    idCategory: number;
    nameCategory: string;
    idLocation: number;
    nameLocation: string;
}

export interface CreateVoucher {
    eventId: number;
    amount: number;
}

export interface CreateReview {
    eventId: number;
    userId: number;
    review: number;
}