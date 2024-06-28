import React, { useState, useEffect } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import styles from './SearchComponent.module.css';
import axios from 'axios';

function SearchComponent({ setSearchResults }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce search term changes
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (debouncedSearchTerm) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/search/search-user`,
                        {
                            params: { searchTerm: debouncedSearchTerm },
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    setSearchResults(response.data.users);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                }
            }
        };

        fetchSearchResults();
    }, [debouncedSearchTerm, setSearchResults]);

    return (
        <div className={styles.searchContainer}>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
            </InputGroup>
        </div>
    );
}

export default SearchComponent;
