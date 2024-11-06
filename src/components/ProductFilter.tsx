import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  TextField, 
  Popover, 
  Checkbox, 
  FormControlLabel, 
  FormGroup,
  useMediaQuery 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FilterList } from '@mui/icons-material';

const FilterContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem',
  flexWrap: 'wrap',
  gap: '1rem',
});

const FilterMenuButton = styled(Button)({
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

const brands = ['Nike', 'Adidas', 'Levi\'s', 'H&M', 'Gap', 'Zara', 'Uniqlo', 'Tommy Hilfiger'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const categories = ['Shirts', 'Pants', 'Dresses', 'Accessories', 'Shoes', 'Outerwear'];

const Filter: React.FC<{
  onFilterChange: (filterOptions: any) => void;
}> = ({ onFilterChange }) => {
  const [filterMenu, setFilterMenu] = useState<null | HTMLElement>(null);
  const [subMenuAnchor, setSubMenuAnchor] = useState<null | HTMLElement>(null);
  const [currentFilterOptions, setCurrentFilterOptions] = useState<string[]>([]);
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    sizes: [],
    categories: [],
    priceRange: [10, 1000]
  });

  const handleFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterMenu(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenu(null);
    setSubMenuAnchor(null);
  };

  const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>, options: string[], type: string) => {
    setCurrentFilterOptions(options);
    setSubMenuAnchor({
      ...event.currentTarget,
      filterType: type
    });
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchor(null);
  };

  const handleFilterOptionSelect = (option: string) => {
    const filterType = subMenuAnchor?.filterType;
    const currentSelected = selectedFilters[filterType] || [];
    const newSelected = currentSelected.includes(option)
      ? currentSelected.filter(item => item !== option)
      : [...currentSelected, option];

    const updatedFilters = {
      ...selectedFilters,
      [filterType]: newSelected
    };

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newPriceRange = [...selectedFilters.priceRange];
    newPriceRange[index] = Number(event.target.value);
    
    const updatedFilters = {
      ...selectedFilters,
      priceRange: newPriceRange
    };

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <FilterContainer>
      <FilterMenuButton
        variant="text"
        endIcon={<FilterList />}
        size="small"
        onClick={handleFilterMenu}
      >
        Filters
      </FilterMenuButton>

      <Menu
        anchorEl={filterMenu}
        open={Boolean(filterMenu)}
        onClose={handleFilterMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={(event) => handleSubMenuOpen(event, brands, 'brands')}>Brands</MenuItem>
        <MenuItem onClick={(event) => handleSubMenuOpen(event, sizes, 'sizes')}>Sizes</MenuItem>
        <MenuItem onClick={(event) => handleSubMenuOpen(event, categories, 'categories')}>Categories</MenuItem>
        <MenuItem>
          <Box display="flex" gap={2}>
            <TextField
              variant="outlined"
              size="small"
              label="Min Price"
              type="number"
              value={selectedFilters.priceRange[0]}
              onChange={(e) => handlePriceChange(e, 0)}
            />
            <TextField
              variant="outlined"
              size="small"
              label="Max Price"
              type="number"
              value={selectedFilters.priceRange[1]}
              onChange={(e) => handlePriceChange(e, 1)}
            />
          </Box>
        </MenuItem>
      </Menu>


      <Popover
        open={Boolean(subMenuAnchor)}
        anchorEl={subMenuAnchor}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: isLargeScreen ? 'center' : 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box p={2} display="flex" flexDirection="column">
          <FormGroup>
            {(subMenuAnchor?.filterType === 'brands' ? brands : 
              subMenuAnchor?.filterType === 'sizes' ? sizes : 
              categories).map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={selectedFilters[subMenuAnchor?.filterType]?.includes(option)}
                    onChange={() => handleFilterOptionSelect(option)}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>
        </Box>
      </Popover>
    </FilterContainer>
  );
};

export default Filter;