  import { sample_cups, sample_tags } from "../data";

  export const getALL = async () => sample_cups;

  export const search = async (searchTerm) => sample_cups
  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  export const getAllTags = async () => sample_tags;

  export const getAllByTag = async tag => {
    if (tag === 'All') return getALL(); 
    return sample_cups.filter(item => item.tags?.includes(tag));
  };

  export const getById = async cupId =>
    sample_cups.find(item => item.id === cupId);
