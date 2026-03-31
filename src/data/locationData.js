// India Administrative Hierarchy Data
// State → District → Block/Taluk → Panchayat → Village

const locationData = {
  "Tamil Nadu": {
    districts: {
      "Chengalpattu": {
        blocks: {
          "Tambaram": {
            panchayats: {
              "Sembakkam Panchayat": ["Sembakkam", "Perumbakkam", "Medavakkam"],
              "Chitlapakkam Panchayat": ["Chitlapakkam", "Pallikaranai", "Nanganallur"],
              "Vandalur Panchayat": ["Vandalur", "Urapakkam", "Guduvancheri"]
            }
          },
          "Kancheepuram": {
            panchayats: {
              "Uthiramerur Panchayat": ["Uthiramerur", "Walajabad", "Kalpakkam"],
              "Sriperumbudur Panchayat": ["Sriperumbudur", "Oragadam", "Maraimalai Nagar"]
            }
          },
          "Thiruporur": {
            panchayats: {
              "Kelambakkam Panchayat": ["Kelambakkam", "Kazhipattur", "Thaiyur"],
              "Thiruporur Panchayat": ["Thiruporur", "Padur", "Siruseri"]
            }
          }
        }
      },
      "Chennai": {
        blocks: {
          "Ambattur": {
            panchayats: {
              "Ambattur Panchayat": ["Ambattur", "Avadi", "Padi"],
              "Korattur Panchayat": ["Korattur", "Villivakkam", "Kolathur"]
            }
          },
          "Sholinganallur": {
            panchayats: {
              "Sholinganallur Panchayat": ["Sholinganallur", "Karapakkam", "Perungudi"],
              "Navalur Panchayat": ["Navalur", "Siruseri", "Padur"]
            }
          }
        }
      },
      "Coimbatore": {
        blocks: {
          "Sulur": {
            panchayats: {
              "Sulur Panchayat": ["Sulur", "Kaniyur", "Selvapuram"],
              "Irugur Panchayat": ["Irugur", "Chettipalayam", "Chinnavedampatti"]
            }
          },
          "Pollachi": {
            panchayats: {
              "Pollachi Panchayat": ["Pollachi", "Kinathukadavu", "Negamam"],
              "Valparai Panchayat": ["Valparai", "Sholayar", "Aliyar"]
            }
          }
        }
      }
    }
  },
  "Karnataka": {
    districts: {
      "Bengaluru Rural": {
        blocks: {
          "Devanahalli": {
            panchayats: {
              "Devanahalli Panchayat": ["Devanahalli", "Vijayapura", "Budigere"],
              "Nandi Panchayat": ["Nandi Hills", "Muddenahalli", "Kanivenarayanapura"]
            }
          },
          "Hosakote": {
            panchayats: {
              "Hosakote Panchayat": ["Hosakote", "Sulibele", "Anugondanahalli"],
              "Jadigenahalli Panchayat": ["Jadigenahalli", "Lakkur", "Nallur"]
            }
          }
        }
      },
      "Mysuru": {
        blocks: {
          "Nanjangud": {
            panchayats: {
              "Nanjangud Panchayat": ["Nanjangud", "Hullahalli", "Devanur"],
              "Hedathale Panchayat": ["Hedathale", "Tagadur", "Sutturu"]
            }
          }
        }
      }
    }
  },
  "Kerala": {
    districts: {
      "Ernakulam": {
        blocks: {
          "Aluva": {
            panchayats: {
              "Aluva Panchayat": ["Aluva", "Eloor", "Kalamassery"],
              "Angamaly Panchayat": ["Angamaly", "Karukutty", "Mala"]
            }
          }
        }
      },
      "Thiruvananthapuram": {
        blocks: {
          "Nedumangad": {
            panchayats: {
              "Nedumangad Panchayat": ["Nedumangad", "Karakulam", "Aruvikkara"],
              "Vithura Panchayat": ["Vithura", "Palode", "Peringammala"]
            }
          }
        }
      }
    }
  }
};

export const getStates = () => Object.keys(locationData);

export const getDistricts = (state) => {
  if (!state || !locationData[state]) return [];
  return Object.keys(locationData[state].districts);
};

export const getBlocks = (state, district) => {
  if (!state || !district || !locationData[state]?.districts[district]) return [];
  return Object.keys(locationData[state].districts[district].blocks);
};

export const getPanchayats = (state, district, block) => {
  if (!state || !district || !block || !locationData[state]?.districts[district]?.blocks[block]) return [];
  return Object.keys(locationData[state].districts[district].blocks[block].panchayats);
};

export const getVillages = (state, district, block, panchayat) => {
  if (!state || !district || !block || !panchayat) return [];
  return locationData[state]?.districts[district]?.blocks[block]?.panchayats[panchayat] || [];
};

export default locationData;
