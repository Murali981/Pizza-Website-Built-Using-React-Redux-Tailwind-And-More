export async function getAddress({ latitude, longitude }) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`, // This is an api
    // which takes user's current latitude and longitude positions as parameters and then it will return the address of the
    // current user's location.
  );
  if (!res.ok) throw Error("Failed getting address");

  const data = await res.json();
  return data;
}
