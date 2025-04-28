import React from "react";

// Location options - assuming these match your schema
const LOCATIONS = [
  "ALL",
  "MAYUR_VIHAR",
  "KANHAIYA_NAGAR",
  "MANSAROVAR_PARK",
  "GTB_NAGAR",
  "KIRTI_NAGAR",
  "SHAHDARA",
  "KASHMERE_GATE",
  "BURARI",
  "OTHER"
];

// Format location for display
const formatLocation = (location) => {
  if (location === "ALL") return "All Locations";
  return location
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

/**
 * Location filter component
 * @param {string} value Current filter value
 * @param {function} onChange Handler for filter change
 */
const LocationFilter = ({ value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex items-center w-full sm:w-auto">
      <label htmlFor="location-filter" className="mr-2 text-sm font-medium">
        Filter by location:
      </label>
      <select
        id="location-filter"
        value={value}
        onChange={handleChange}
        className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5"
      >
        {LOCATIONS.map((location) => (
          <option key={location} value={location}>
            {formatLocation(location)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationFilter;
export { formatLocation, LOCATIONS };
