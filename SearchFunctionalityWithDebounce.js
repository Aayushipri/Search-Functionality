/** @format */

import { useState, useEffect } from "react";

const SearchFunctionalityWithDebounce = () => {
  const [userData, setUserData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredUser, setFilteredUser] = useState({});

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched data", data);
        setUserData(data);
      })
      .catch((error) => {
        console.log("catched error while fetching data", error);
      });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const filterTimer = setTimeout(() => {
      try {
        fetch(
          `https://jsonplaceholder.typicode.com/users?username=${searchText}`,
          {
            signal: abortController.signal,
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Filtered user", data);
            setFilteredUser(data[0]);
          });
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request was aborted");
        } else {
          console.error("Error fetching user data");
        }
      }
    }, 30000);

    return () => {
      abortController.abort();
      clearTimeout(filterTimer);
    };
  }, [searchText]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h4>Users data</h4>
      <input
        type="text"
        placeholder="Search by username"
        value={searchText}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      <table
        style={{
          borderCollapse: "collapse",
          margin: "auto",
          border: "1px solid red",
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {userData &&
            userData.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <h4>Search Result</h4>
        {filteredUser && filteredUser.name}
      </div>
    </div>
  );
};

export default SearchFunctionalityWithDebounce;
