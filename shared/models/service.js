import mongoose from "mongoose";

const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: null },
    banners: [
      { type: String, defaut: null }
    ],
    commission: { type: String, defaut: null},
    includedContent: { type: String, default: null },
    excludedContent: { type: String, default: null },
    about: { type: String, default: null },
    seo: {
      imageAltText: { type: String, default: null },
      metaTag: { type: String, default: null },
      metaDescription: { type: String, default: null },
      h1Title: { type: String, default: null },
      h2Title: { type: String, default: null },
      howItWorks: [
        { type: String, default: null }
      ],
      footerContent: { type: String, default: null }
    },
    pageUrl1: { type: String, default: null },
    pageUrl2: { type: String, default: null },
    faqs: [
      {
        question: { type: String, default: null },
        answer: { type: String, default: null }
      }
    ],
    servicableCities: [
      { type: String, default: null, required: true }
    ],
    paymentModes: [
      { type: String, default: null, required: true }
    ],
    price: { type: Number, default: 0 },
    priceGuide: { type: String, default: null },
    filters: [
      {
        title: { type: String, required: true },
        options: [
          {
            value: { type: String, default: null },
            price: { type: Number, default: null }
          }
        ]
      }
    ],
    status: { type: String, default: 'Active' },
 },
  {
    timestamp: true,
  }
);

const Service = mongoose.model("service", schema);

export default Service;