import {
  FileText,
  ShieldCheck,
  Banknote,
  Sparkles,
  Award,
  Building2,
  Landmark,
  MapPin,
  PackageCheck,
  Ship,
  Truck,
  Globe,
  Repeat,
  ClipboardList,
  Boxes,
  BadgePercent,
  Leaf,
  Handshake,
  Compass,
  Layers,
  Plane,
  UserRound,
  History,
  Bell,
  type LucideIcon,
} from "lucide-react";

export const company = {
  name: "Navkar Global Sourcing",
  tagline: "Export • Import • DGFT & Customs",
  // Welcome copy adapted from the source site
  welcome: `Founded in January 2000 in Mumbai under the vision of Mr. Shashikant Mali (as Navkar Exim), Navkar Global Sourcing has grown into an integrated Import–Export (EXIM) consultancy and logistics ecosystem designed to simplify global trade through transparent, customer-focused execution and expert advisory—covering both DGFT consultancy and Custom/Customs support with end-to-end guidance and documentation. With a strong presence as an Import Export Consultancy in Mumbai, Pune & Delhi, and associate support/services across India, the group operates as a unified ecosystem of four specialized companies.`,
  welcomeSecond: `Backed by 25+ years of experience, a 100+ professional team, and memberships such as F.E.F.A., E.I.D.A., B.C.B.A. and the Indo-German Chambers of Commerce, Navkar Global Sourcing is trusted by 100+ MNCs, Corporates, and MSMEs for compliant, reliable, and growth-focused import-export solutions.`,
  shortDescription:
    "An integrated EXIM consultancy and logistics ecosystem simplifying global trade through transparent, customer-focused execution and expert advisory — since 2000.",
  founded: 2000,
  yearsExperience: 25,
  founder: "Mr. Shashikant Mali",
  address: "12-A Mahendra Industrial Premises, Sion (East), Mumbai, 400 022",
  phone: "+91 9892575304",
  email: "sales@navkarglobalsourcing.com",
  social: {
    twitter: "#",
    linkedin: "#",
    instagram: "#",
    facebook: "#",
  },
};

// Rotating hero taglines used on the live stargroup.in hero — verbatim
export const heroSlides = [
  {
    line1: "Your Complete In-House",
    line2: "Logistics Partner",
    line3: "From Consultancy to Delivery",
  },
  {
    line1: "Reliable Transportation,",
    line2: "Anytime Anywhere",
  },
  {
    line1: "Swift & Seamless",
    line2: "Customs Clearance",
  },
  {
    line1: "End-to-End",
    line2: "Logistics Solution",
  },
  {
    line1: "Global Freight Forwarding,",
    line2: "Made Easy",
  },
];

export const stats = [
  { value: "25+", label: "Years of Experience" },
  { value: "100+", label: "Professional Staff" },
  { value: "500+", label: "Satisfied Clients" },
  { value: "3", label: "Offices Across India" },
];

export type Service = {
  slug: string;
  title: string;
  // NOTE: blurbs are EDITORIAL — not from stargroup.in. Replace before launch.
  blurb: string;
  icon: LucideIcon;
  group: "Advisory" | "Licensing" | "Logistics" | "Compliance";
};

// 18 service titles from stargroup.in Services mega-menu (verbatim).
// Blurbs below are editorial placeholders — the brand should replace.
export const services: Service[] = [
  { slug: "exim-consultancy", title: "Export Import Consultancy", blurb: "End-to-end advisory across DGFT, customs, FEMA and trade policy.", icon: Globe, group: "Advisory" },
  { slug: "import-export-license", title: "License For Import & Export", blurb: "Filing, follow-through and grant assistance for IEC, RCMC, AEO and authorisation licenses.", icon: FileText, group: "Licensing" },
  { slug: "duty-refund", title: "Duty Refund Cases", blurb: "Recovery of SAD refunds, drawback claims and disputed-duty resolution.", icon: Banknote, group: "Advisory" },
  { slug: "allied-services", title: "Allied Services", blurb: "Auxiliary registrations across BIS, FSSAI, APEDA and partner-government agencies.", icon: Sparkles, group: "Compliance" },
  { slug: "recognition-certification", title: "Recognition & Certification", blurb: "Star Export House — One-Star to Five-Star status pursuit.", icon: Award, group: "Licensing" },
  { slug: "dgft-delhi-support", title: "Support At DGFT Delhi", blurb: "On-ground representation at DGFT headquarters for policy interpretations and hearings.", icon: Landmark, group: "Advisory" },
  { slug: "central-subsidy", title: "Subsidy From Central Ministries", blurb: "Identify, file and unlock subsidies from central ministry schemes.", icon: BadgePercent, group: "Advisory" },
  { slug: "state-subsidy", title: "Subsidy From Maharashtra State Government", blurb: "Maharashtra-specific incentive schemes — packaged, filed and followed to disbursement.", icon: MapPin, group: "Advisory" },
  { slug: "custom-clearance", title: "Custom Clearance", blurb: "Documentation, classification and clearance for sea, air and ICD ports.", icon: ShieldCheck, group: "Logistics" },
  { slug: "freight-forwarding", title: "Freight Forwarding", blurb: "Door-to-door multimodal forwarding through a vetted network of carriers.", icon: Ship, group: "Logistics" },
  { slug: "transportation", title: "Transportation", blurb: "Pan-India inland movement, last-mile distribution and bonded transfers.", icon: Truck, group: "Logistics" },
  { slug: "mnc-compliance", title: "Compliance For MNCs", blurb: "Audits, scheme-utilisation reviews and policy briefings for multinational compliance teams.", icon: ClipboardList, group: "Compliance" },
  { slug: "sale-purchase-transferable", title: "Sale Purchase Of Transferable", blurb: "Liquidity for unused scrips — valuation and broker-of-record execution.", icon: Repeat, group: "Advisory" },
  { slug: "registration-import-export", title: "Registration For Import Export", blurb: "IEC, GST-LUT, RCMC and port registrations.", icon: PackageCheck, group: "Licensing" },
  { slug: "cargo-compliance", title: "Compliance For Import Export Cargo", blurb: "Shipment-level conformance checks against FTP, customs and PGA requirements.", icon: Boxes, group: "Compliance" },
  { slug: "duty-exemption", title: "Duty Exemption Schemes Registration At Custom", blurb: "Customs registration for EPCG, Advance Authorisation and other duty-exemption frameworks.", icon: ShieldCheck, group: "Licensing" },
  { slug: "development-commissioner", title: "Activities At Development Commissioner Office", blurb: "SEZ, EOU and STPI matters — approvals, renewals, debonding and representation.", icon: Building2, group: "Compliance" },
  { slug: "pollution-control", title: "Activities At Pollution Control Board", blurb: "Consent to operate, hazardous-waste authorisations and environmental clearances.", icon: Leaf, group: "Compliance" },
];

// Sourcing plan tiers — the primary service model.
// Card front shows the pointer bullets; the "More details" expander shows
// the elaborated write-up. Pricing marked "On request" until finalised.
export type Plan = {
  slug: string;
  name: string;
  tagline: string;                 // Short who-it's-for line
  icon: LucideIcon;
  price: string;                   // "On request" until finalised
  priceNote?: string;              // e.g. "Quoted case-to-case"
  pointers: string[];              // Card-front bullet list
  details: string;                 // Elaborated write-up
  featured?: boolean;              // Visual emphasis for the recommended plan
};

export const plans: Plan[] = [
  {
    slug: "basic",
    name: "Basic",
    tagline: "If you already have your supplier.",
    icon: Handshake,
    price: "Shared on enquiry",
    priceNote: "Pricing details will be shared shortly",
    pointers: [
      "Contact Suppliers",
      "Payment Assistance",
      "Receiving Products",
      "Counting Quantity",
      "Random Inspection of Product",
      "Shipping & Logistics Arrangement",
      "Warehouse Support",
    ],
    details:
      "If you already have your own suppliers but need a reliable partner in China to manage quality inspections and coordinate shipments on your behalf, our Basic China Sourcing Services Plan is the ideal solution. We act as your local representative, ensuring that products meet your quality standards before dispatch and that shipments are handled efficiently, giving you peace of mind throughout the process.",
  },
  {
    slug: "pro",
    name: "Pro",
    tagline: "If you don't have a supplier yet.",
    icon: Compass,
    price: "Shared on enquiry",
    priceNote: "Pricing details will be shared shortly",
    featured: true,
    pointers: [
      "Product Categorization",
      "Supplier Sourcing",
      "Competitive Price Negotiation",
      "Supplier Verification",
      "Custom Branding Support",
      "Shipping & Logistics Coordination",
      "Production Follow-Up",
      "Sample Support",
    ],
    details:
      "Under this plan, we provide end-to-end support throughout the entire sourcing journey — from supplier identification to final delivery. Our team will assist you in finding the most suitable suppliers in China, obtaining competitive quotations, evaluating supplier capabilities, and securing the best manufacturing solutions to meet your requirements. We will coordinate closely with suppliers to ensure a smooth, efficient, and reliable sourcing process.",
  },
  {
    slug: "custom",
    name: "Custom",
    tagline: "Bundled solutions, quoted case-to-case.",
    icon: Layers,
    price: "Quoted case-to-case",
    priceNote: "Pricing details will be shared shortly",
    pointers: [
      "Tailor-Made Sourcing Solutions",
      "Import & Logistics Support",
      "Payment Routing & Support",
      "Shipment Consolidation",
      "Pcs-to-Pcs Verification",
      "Factory Audit & Inspection",
      "Procurement & Supplier Management",
      "Sampling Checked & Supported",
      "Supplier Sourcing",
      "Warehouse Support",
    ],
    details:
      "In addition to our Basic and Pro plans, we offer a range of tailored solutions to meet specific client requirements. These specialized services are bundled under our Custom China Sourcing Services Plan, providing flexible and personalized support based on your unique sourcing, quality control, logistics, and supplier management needs.",
  },
  {
    slug: "custom-pro",
    name: "Custom Pro",
    tagline: "For clients travelling to China themselves.",
    icon: Plane,
    price: "Quoted case-to-case",
    priceNote: "Pricing details will be shared shortly",
    pointers: [
      "Business Travel Assistance",
      "Supplier Audits & Verification",
      "Language & Communication Support",
      "Supplier & Factory Meeting Coordination",
      "End-to-End Project Management",
      "Trade Show Assistance",
    ],
    details:
      "Our Custom Pro Plan is designed to address your unique sourcing and procurement needs. Whether you're looking to visit China to meet manufacturers, tour production facilities, or assess products in person, we provide end-to-end travel and business coordination support. From itinerary planning and supplier scheduling to factory visits and meeting arrangements, our team ensures a seamless and productive experience throughout your trip.",
  },
];

// Categories the group actively sources across — used on the /services page
// and on the home ProductCategories block.
export const productCategories = [
  "Toys",
  "Clothing",
  "Jewellery",
  "Furniture",
  "Accessories",
  "Electronics",
  "Stationery",
  "Hardware",
  "Machinery & vehicles",
  "Home decor & gifts",
  "Footwear & bags",
];

// Industries: from initial WebFetch of stargroup.in. Not visible in the
// home-page screenshots provided — verify against the live site before launch.
export const industries = [
  "Agro",
  "Air Conditioning",
  "Automobile",
  "Chemical",
  "Cosmetics",
  "Electrical",
  "Engineering",
  "Entertainment",
  "Food",
  "Furniture",
  "General Trade",
];

// Four subsidiary entities that make up the Navkar Global Sourcing group.
export const groupCompanies = [
  {
    name: "Navkar Exim Management Consultancy & Services Pvt. Ltd.",
    role: "Consultancy & services across DGFT, Excise, Customs and Service Tax.",
  },
  {
    name: "Navkar India Logistics",
    role: "Custom clearance, freight forwarding and pan-India transportation.",
  },
  {
    name: "Tisha Enterprises",
    role: "Sale & purchase of Chapter-3 and MEIS licences — realising selling benefits for exporters and duty savings for importers.",
  },
  {
    name: "Alisha Enterprises",
    role: "Company registration, product approval and online tender filing & execution.",
  },
];

// Verbatim from welcome panel
export const memberships = [
  "F.E.F.A.",
  "E.I.D.A.",
  "B.C.B.A.",
  "Indo-German Chambers of Commerce",
];

// Formal recognitions — memberships + ISO 9001:2015 quality-management
// certifications held across the group's operating entities. Rendered on
// the About page under the /about#certifications anchor (linked from the
// navbar About dropdown).
export type Certification = {
  slug: string;
  kind: "Membership" | "ISO 9001:2015";
  title: string;
  entity: string;
  body: string[];        // Paragraphs — rendered in order
  featured?: boolean;    // Visual emphasis (Indo-German is the standout)
};

// NOTE: certification body copy uses "Navkar Global Sourcing" as the
// holding entity. If the group has separately registered legal entities
// under which the ISO 9001:2015 audits or IGCC membership are held,
// swap the `entity` field per certification with the correct name.
export const certifications: Certification[] = [
  {
    slug: "igcc-membership",
    kind: "Membership",
    title: "Indo-German Chamber of Commerce (IGCC) — Membership",
    entity: "Navkar Global Sourcing",
    featured: true,
    body: [
      "Navkar Global Sourcing is a member of the Indo-German Chamber of Commerce (IGCC) — one of the most respected bilateral trade networks between India and Germany.",
      "The membership reflects our international outlook and gives clients direct footing in cross-border opportunities backed by IGCC's institutional standards.",
    ],
  },
  {
    slug: "iso-advisory-licensing",
    kind: "ISO 9001:2015",
    title: "ISO 9001:2015 — Advisory & Licensing",
    entity: "Navkar Global Sourcing — Advisory & Licensing",
    body: [
      "Our advisory and licensing practice is certified to ISO 9001:2015 — Quality Management System.",
      "Every DGFT filing, customs matter and PGA registration is executed under documented procedures with monitored review — a daily discipline behind accurate, on-time outcomes.",
    ],
  },
  {
    slug: "iso-logistics",
    kind: "ISO 9001:2015",
    title: "ISO 9001:2015 — Logistics & Clearance",
    entity: "Navkar Global Sourcing — Logistics",
    body: [
      "Our customs clearance, freight forwarding and transportation operations are certified to ISO 9001:2015 — Quality Management System.",
      "Every shipment moves under defined procedures, quality checks and continuous performance monitoring — consistent service standards, fewer surprises in transit.",
    ],
  },
  {
    slug: "iso-license-desk",
    kind: "ISO 9001:2015",
    title: "ISO 9001:2015 — Licence Trading Desk",
    entity: "Navkar Global Sourcing — Licence Desk",
    body: [
      "Our licence sales and purchase desk for importers and exporters is certified to ISO 9001:2015 — Quality Management System.",
      "Every transaction is governed by controlled processes, proper documentation and regular quality review — clients navigate complex licensing with confidence and clarity.",
    ],
  },
];

// Real client logos shown in the OUR Clientele carousel on stargroup.in
export const logoClients = [
  { name: "Cargill", src: "/partnerlogos/cargill.png" },
  { name: "Adlabs", src: "/partnerlogos/adlabs.png" },
  { name: "Adeka", src: "/partnerlogos/adeka.png" },
  { name: "Croda", src: "/partnerlogos/croda.png" },
  { name: "Voltas", src: "/partnerlogos/voltas.png" },
  { name: "Piaggio", src: "/partnerlogos/piaggio.png" },
];

// Verbatim testimonial quotes from stargroup.in OUR TESTIMONIALS section
export const testimonials = [
  {
    quote:
      "We Would like to take this opportunity to express our appreciation for the good services, which we have received from your company M/S Navkar Exim Management Consultancy & Services Pvt. Ltd. The staff was warm and accommodating and they were helpful to us regarding SAD Refund, FMS LICENSE, BOND CANCELLATION OF EPCG LICENSE & ADVANCE LICENSE Services.",
    name: "Client",
    company: "RR Global Ltd",
  },
  {
    quote:
      "We would like to take this opportunity to thank and appreciate M/s. Navkar Exim Management Consultancy & Services Pvt. Ltd for their sincere efforts regarding Advance / EPCG License…",
    name: "Client",
    company: "Alicon Castalloy Ltd",
  },
  {
    quote:
      "We would like to take this opportunity to thank and appreciate M/s. Navkar Exim Management Consultancy & Services Pvt. Ltd., for their dedicated efforts in all the segments of the work.",
    name: "Client",
    company: "Ruchi Soya",
  },
];

// Latest DGFT / Custom / GST updates pulled from the Notifications panel
// on the stargroup.in homepage at the time of redesign. Replace with a
// live feed before launch.
export const latestUpdates = [
  {
    type: "Custom",
    title: "Notification No.57/2026 Customs (N.T.) DT.18.06.2026",
    summary: "Seeks to amend Notification No.27/2018 Customs (N.T.).",
    date: "20 June 2026",
  },
  {
    type: "Custom",
    title: "Notification No.56/2026 Customs (N.T.) dt.16.06.2026",
    summary: "Seeks to amend Notification No.21/2022 for Jurisdiction.",
    date: "20 June 2026",
  },
  {
    type: "Custom",
    title: "Notification No.55/2026 Customs (N.T.) dt.15.06.2026",
    summary: "Fixation of Tariff value of Edible oil, Brass Scrap and others.",
    date: "20 June 2026",
  },
  {
    type: "Custom",
    title: "Circular No.28/2026 dt.15.06.2026",
    summary: "Testing of samples of Export Consignments allowed.",
    date: "20 June 2026",
  },
];

export type NavChild = {
  href: string;
  label: string;
  blurb?: string;
  icon?: LucideIcon;
};
export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
  mega?: boolean;
};

// Navigation mirrors the stargroup.in primary nav, including dropdowns
export const nav: NavItem[] = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      {
        href: "/about#profile",
        label: "Profile",
        blurb: "The story behind Navkar Global Sourcing.",
        icon: UserRound,
      },
      {
        href: "/about#principles",
        label: "What we stand for",
        blurb: "Four principles that shape every mandate.",
        icon: Compass,
      },
      {
        href: "/about#journey",
        label: "Journey",
        blurb: "25+ years of quiet accountability in EXIM.",
        icon: History,
      },
      {
        href: "/about#group-companies",
        label: "Group of Companies",
        blurb: "Four entities, one accountable ecosystem.",
        icon: Building2,
      },
      {
        href: "/about#certifications",
        label: "Certifications",
        blurb: "F.E.F.A., E.I.D.A., B.C.B.A. and Indo-German Chambers.",
        icon: Award,
      },
    ],
  },
  { href: "/services", label: "Services", mega: true },
  { href: "/clientele", label: "Clientele" },
  {
    href: "/notifications",
    label: "Notifications",
    children: [
      {
        href: "/notifications?type=dgft",
        label: "DGFT",
        blurb: "Foreign Trade Policy notifications.",
        icon: Landmark,
      },
      {
        href: "/notifications?type=custom",
        label: "Custom",
        blurb: "CBIC customs notifications & circulars.",
        icon: ShieldCheck,
      },
      {
        href: "/notifications?type=gst",
        label: "GST",
        blurb: "GST updates relevant to EXIM.",
        icon: BadgePercent,
      },
      {
        href: "/notifications",
        label: "All updates",
        blurb: "The full advisory-desk feed.",
        icon: Bell,
      },
    ],
  },
  { href: "/contact", label: "Contact" },
];
