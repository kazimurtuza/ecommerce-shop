"use client";

export interface Product {
  id: number;
  name: string;
  price: string; // formats like "$18.99" or "18.99"
  tag: string;
  stock: number;
  status: "Published" | "Draft";
  image: string;
  description?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  total: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
  itemsCount: number;
  subtotal?: string;
  shipping?: string;
  discount?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentStatus?: "Paid" | "Unpaid" | "Refunded";
  items?: OrderItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "Admin" | "Customer" | "Moderator";
  registeredDate: string;
  status: "Active" | "Suspended";
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Matching Family Sleeveless Floral Outfits Black",
    price: "$18.99",
    tag: "Family Matching",
    stock: 24,
    status: "Published",
    image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=450&h=560&fit=crop&q=80",
    description: "Perfect matching floral outfits for the family. Crafted from breathable cotton blend fabric featuring a beautiful sleeveless floral pattern. Great for summer outings.",
  },
  {
    id: 2,
    name: "Matching Family Polo Collar Sleeveless Floral Outfits",
    price: "$18.99",
    tag: "Family Matching",
    stock: 5,
    status: "Published",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=450&h=560&fit=crop&q=80",
    description: "Cute polo collar summer outfits for parent and child matching. High quality comfortable fabric.",
  },
  {
    id: 3,
    name: "Disney Matching Family Stripe Outfits",
    price: "$15.99",
    tag: "Mickey & Friends",
    stock: 0,
    status: "Published",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=450&h=560&fit=crop&q=80",
    description: "Adorable Mickey & Friends themed stripes matching clothes. Officially licensed design.",
  },
  {
    id: 4,
    name: "Matching Family Tropical Outfits Deep Blue",
    price: "$15.99",
    tag: "Family Matching",
    stock: 45,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=450&h=560&fit=crop&q=80",
    description: "Tropical style outfits perfect for family beach vacations. Deep blue theme.",
  },
  {
    id: 5,
    name: "Matching Family Sunflower Sleeveless Outfits",
    price: "$16.99",
    tag: "Family Matching",
    stock: 12,
    status: "Published",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=450&h=560&fit=crop&q=80",
    description: "Sunny yellow sunflower pattern sleeveless outfits for the whole family.",
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-9482",
    customerName: "Farhan Rahman",
    customerEmail: "farhan@example.com",
    customerPhone: "+880 1712 345678",
    date: "Aug 23, 2026 at 10:14 PM",
    subtotal: "$37.98",
    shipping: "$18.99",
    discount: "$0.00",
    total: "$56.97",
    status: "Processing",
    itemsCount: 3,
    shippingAddress: "House 45, Road 11, Banani, Dhaka, Bangladesh",
    paymentMethod: "Credit Card (Visa ending in 4242)",
    paymentStatus: "Paid",
    items: [
      {
        id: 1,
        name: "Matching Family Sleeveless Floral Outfits Black",
        price: "$18.99",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
  {
    id: "ORD-9481",
    customerName: "Tasmia Islam",
    customerEmail: "tasmia@example.com",
    customerPhone: "+880 1812 765432",
    date: "Aug 23, 2026 at 3:30 PM",
    subtotal: "$109.50",
    shipping: "$15.00",
    discount: "$0.00",
    total: "$124.50",
    status: "Completed",
    itemsCount: 5,
    shippingAddress: "Flat 4B, Building 12, Gulshan 2, Dhaka, Bangladesh",
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Paid",
    items: [
      {
        id: 2,
        name: "Matching Family Polo Collar Sleeveless Floral Outfits",
        price: "$18.99",
        quantity: 5,
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
  {
    id: "ORD-9480",
    customerName: "Anisur Zaman",
    customerEmail: "anis@example.com",
    customerPhone: "+880 1912 998877",
    date: "Aug 22, 2026 at 11:15 AM",
    subtotal: "$18.99",
    shipping: "$0.00",
    discount: "$0.00",
    total: "$18.99",
    status: "Pending",
    itemsCount: 1,
    shippingAddress: "Sector 4, Uttara, Dhaka, Bangladesh",
    paymentMethod: "bKash",
    paymentStatus: "Unpaid",
    items: [
      {
        id: 1,
        name: "Matching Family Sleeveless Floral Outfits Black",
        price: "$18.99",
        quantity: 1,
        image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
  {
    id: "ORD-9479",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat@example.com",
    customerPhone: "+880 1512 112233",
    date: "Aug 22, 2026 at 09:20 AM",
    subtotal: "$72.40",
    shipping: "$15.00",
    discount: "$0.00",
    total: "$87.40",
    status: "Shipped",
    itemsCount: 4,
    shippingAddress: "Road 4, Dhanmondi, Dhaka, Bangladesh",
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    items: [
      {
        id: 4,
        name: "Matching Family Tropical Outfits Deep Blue",
        price: "$15.99",
        quantity: 4,
        image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
  {
    id: "ORD-9478",
    customerName: "Mahmudul Hasan",
    customerEmail: "mahmud@example.com",
    customerPhone: "+880 1612 445566",
    date: "Aug 21, 2026 at 04:45 PM",
    subtotal: "$34.98",
    shipping: "$0.00",
    discount: "$0.00",
    total: "$34.98",
    status: "Cancelled",
    itemsCount: 2,
    shippingAddress: "Mirpur 10, Dhaka, Bangladesh",
    paymentMethod: "Nagad",
    paymentStatus: "Refunded",
    items: [
      {
        id: 5,
        name: "Matching Family Sunflower Sleeveless Outfits",
        price: "$16.99",
        quantity: 2,
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&q=80",
      },
    ],
  },
];

const INITIAL_USERS: User[] = [
  { id: 1, name: "Admin Demo", email: "admin@hatbazar.com", role: "Admin", registeredDate: "Jun 01, 2026", status: "Active" },
  { id: 2, name: "Farhan Rahman", email: "farhan@example.com", role: "Customer", registeredDate: "Aug 15, 2026", status: "Active" },
  { id: 3, name: "Tasmia Islam", email: "tasmia@example.com", role: "Customer", registeredDate: "Aug 16, 2026", status: "Active" },
  { id: 4, name: "Mahmudul Hasan", email: "mahmud@example.com", role: "Moderator", registeredDate: "Jul 10, 2026", status: "Active" },
  { id: 5, name: "Nusrat Jahan", email: "nusrat@example.com", role: "Customer", registeredDate: "Aug 20, 2026", status: "Suspended" },
];

export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  const stored = localStorage.getItem("hb_products");
  if (!stored) {
    localStorage.setItem("hb_products", JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("hb_products", JSON.stringify(products));
};

export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  const stored = localStorage.getItem("hb_orders");
  if (!stored) {
    localStorage.setItem("hb_orders", JSON.stringify(INITIAL_ORDERS));
    return INITIAL_ORDERS;
  }
  return JSON.parse(stored);
};

export const saveOrders = (orders: Order[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("hb_orders", JSON.stringify(orders));
};

export const getOrderById = (id: string): Order | null => {
  const orders = getOrders();
  return orders.find((o) => o.id === id) || null;
};

export const saveOrderById = (order: Order) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === order.id);
  if (index !== -1) {
    orders[index] = order;
  } else {
    orders.unshift(order); // Put new orders at the top of the list
  }
  saveOrders(orders);
};

export const getUsers = (): User[] => {
  if (typeof window === "undefined") return INITIAL_USERS;
  const stored = localStorage.getItem("hb_users");
  if (!stored) {
    localStorage.setItem("hb_users", JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(stored);
};

export const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("hb_users", JSON.stringify(users));
};
