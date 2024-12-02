import { useState } from 'react';
import { InputBase, alpha, styled, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useGoogleAutocomplete } from '../../hooks/useGoogleAutocomplete';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const SearchWrapper = styled('form')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  color: theme.palette.common.white,
}));

interface SearchBarProps {
  onLocationSelect: (location: google.maps.LatLngLiteral) => void;
  onSearchQuery?: (query: string) => void;
}

const SearchBar = ({ onLocationSelect, onSearchQuery }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState('');
  const { searchInputRef } = useGoogleAutocomplete({
    onPlaceSelect: (location, address) => {
      onLocationSelect(location);
      setSearchInput(address);
    },
    onSearchQuery
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearchQuery) {
      onSearchQuery(searchInput.trim());
    }
  };

  return (
    <SearchWrapper onSubmit={handleSubmit}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          inputRef={searchInputRef}
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Search for rinks…"
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>
      <SearchButton 
        type="submit" 
        aria-label="search"
      >
        <SearchIcon />
      </SearchButton>
    </SearchWrapper>
  );
};

export default SearchBar; 