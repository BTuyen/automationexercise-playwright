// Suffix random để tránh trùng khi 2 test cùng chạy trong 1 ms (parallel workers)
function uniqueSuffix() {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function generateUniqueEmail() {
  return `user${uniqueSuffix()}@example.com`;
}

// TC_AUTH_06 - EP valid class khác: email có dấu + và subdomain, vẫn phải unique
export function generatePlusTagEmail() {
  return `user${uniqueSuffix()}+tag@mail.example.com`;
}

export function generateUser() {
  const timestamp = Date.now();
  return {
    email: generateUniqueEmail(),
    name: `User${timestamp}`,
    title: (Math.random() < 0.5 ? "Mr" : "Mrs") as "Mr" | "Mrs",
    day: `${Math.floor(Math.random() * 28) + 1}`, // Random day between 1 and 28
    month: `${Math.floor(Math.random() * 12) + 1}`, // Random month between 1 and 12
    year: `${Math.floor(Math.random() * (2000 - 1970 + 1)) + 1970}`, // Random year between 1970 and 2000
    newsletter: Math.random() < 0.5,
    optin: Math.random() < 0.5,
    password: `Password${timestamp}`,
    firstName: `FirstName${timestamp}`,
    lastName: `LastName${timestamp}`,
    company: `Company${timestamp}`,
    address1: `Address1 ${timestamp}`,
    address2: `Address2 ${timestamp}`,
    country: "United States",
    state: `State${timestamp}`,
    city: `City${timestamp}`,
    zipcode: `${Math.floor(Math.random() * 90000) + 10000}`, // Random 5-digit number
    mobileNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}` // Random 10-digit number
  };
}
