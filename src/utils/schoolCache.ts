interface School {
  udise: string;
  name: string;
  address?: string;
  district?: string;
  block?: string;
}

interface CachedSchoolData {
  schools: School[];
  timestamp: number;
  expiresAt: number;
}

export const schoolCacheUtils = {
  // Get cached schools
  getCachedSchools: (): School[] => {
    try {
      const cached = localStorage.getItem('cached_schools');
      if (!cached) return [];
      
      const data: CachedSchoolData = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem('cached_schools');
        return [];
      }
      
      return data.schools;
    } catch (error) {
      console.error('Error reading cached schools:', error);
      return [];
    }
  },

  // Find school by UDISE code in cache
  findCachedSchool: (udise: string): School | null => {
    const schools = schoolCacheUtils.getCachedSchools();
    return schools.find(school => school.udise === udise) || null;
  },

  // Check if cache needs cleanup (should be called on app start when online)
  cleanupExpiredCache: (): boolean => {
    try {
      const cached = localStorage.getItem('cached_schools');
      if (!cached) return false;
      
      const data: CachedSchoolData = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > data.expiresAt) {
        localStorage.removeItem('cached_schools');
        return true; // Cache was cleaned
      }
      
      return false; // Cache is still valid
    } catch (error) {
      console.error('Error during cache cleanup:', error);
      localStorage.removeItem('cached_schools'); // Remove corrupted cache
      return true;
    }
  },

  // Add schools to cache
  addSchoolsToCache: (schools: School[]): void => {
    try {
      const existingSchools = schoolCacheUtils.getCachedSchools();
      const allSchools = [...existingSchools];
      
      // Add new schools, avoiding duplicates
      schools.forEach(newSchool => {
        if (!allSchools.find(existing => existing.udise === newSchool.udise)) {
          allSchools.push(newSchool);
        }
      });
      
      const cacheData: CachedSchoolData = {
        schools: allSchools,
        timestamp: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };
      
      localStorage.setItem('cached_schools', JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error adding schools to cache:', error);
    }
  },

  // Get cache info for debugging
  getCacheInfo: (): { count: number; expiresAt: number; daysLeft: number } | null => {
    try {
      const cached = localStorage.getItem('cached_schools');
      if (!cached) return null;
      
      const data: CachedSchoolData = JSON.parse(cached);
      const daysLeft = Math.max(0, Math.ceil((data.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
      
      return {
        count: data.schools.length,
        expiresAt: data.expiresAt,
        daysLeft
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  }
};

export type { School, CachedSchoolData };