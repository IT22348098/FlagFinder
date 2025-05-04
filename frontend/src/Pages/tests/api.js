// src/services/api.js

/**
 * API service for fetching country data from the REST Countries API
 * This module contains methods for interacting with the external API
 */

const API_BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Fetch all countries from the API
 * @returns {Promise<Array>} Promise resolving to an array of country objects
 */
export const getAllCountries = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

/**
 * Fetch a specific country by its 3-letter country code
 * @param {string} countryCode - The 3-letter country code (e.g., 'USA', 'FRA')
 * @returns {Promise<Object>} Promise resolving to the country object
 */
export const getCountryByCode = async (countryCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alpha/${countryCode}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data[0]; // API returns an array with single country
  } catch (error) {
    console.error(`Error fetching country ${countryCode}:`, error);
    throw error;
  }
};

/**
 * Fetch countries by region
 * @param {string} region - The region name (e.g., 'Europe', 'Asia')
 * @returns {Promise<Array>} Promise resolving to an array of country objects
 */
export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${API_BASE_URL}/region/${region}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching countries in region ${region}:`, error);
    throw error;
  }
};

/**
 * Search countries by name
 * @param {string} name - The country name to search for
 * @returns {Promise<Array>} Promise resolving to an array of country objects
 */
export const searchCountriesByName = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/name/${name}`);
    
    if (!response.ok) {
      // If the country isn't found, return an empty array instead of throwing
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error searching countries by name ${name}:`, error);
    throw error;
  }
};

/**
 * Get all supported language codes from all countries
 * @returns {Promise<Array>} Promise resolving to an array of unique language codes
 */
export const getAllLanguages = async () => {
  try {
    // First, get all countries
    const countries = await getAllCountries();
    
    // Extract all language objects and create a set of unique language codes
    const languagesSet = new Set();
    
    countries.forEach(country => {
      if (country.languages) {
        // Add each language code and name as an object to the set
        Object.entries(country.languages).forEach(([code, name]) => {
          languagesSet.add(JSON.stringify({ code, name }));
        });
      }
    });
    
    // Convert back to array of objects
    const languages = Array.from(languagesSet).map(lang => JSON.parse(lang));
    
    // Sort alphabetically by language name
    return languages.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

/**
 * Get all supported regions
 * @returns {Promise<Array>} Promise resolving to an array of unique region names
 */
export const getAllRegions = async () => {
  try {
    // First, get all countries
    const countries = await getAllCountries();
    
    // Extract all regions and create a set of unique region names
    const regionsSet = new Set();
    
    countries.forEach(country => {
      if (country.region) {
        regionsSet.add(country.region);
      }
    });
    
    // Convert to array and sort alphabetically
    const regions = Array.from(regionsSet).sort();
    return regions;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

export default {
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountriesByName,
  getAllLanguages,
  getAllRegions
};