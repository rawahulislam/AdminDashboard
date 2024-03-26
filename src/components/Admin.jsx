import React, { useEffect, useState } from "react";
import "../css/admin.css";
import { Users } from "../api/usersapi";

export default function Admin() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [edit, setEdit] = useState(false);
  const [save, setSaved] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [slice, setSlice] = useState(10);
  const [removePrevious, setRemove] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);

  let totalPages = Math.ceil(data.length / 10);

  function handlePageswithNum(pageNumber) {
    setCurrentPage(pageNumber);
    const begin = (pageNumber - 1) * 10;
    const end = begin + 10;
    setSlice(end);
    setRemove(begin);
  }

  function handleSelectAll(e) {
    let sliced = (currentPage -1) * 10
    let end = sliced + 10
    console.log(sliced)
    setSelectAll(e.target.checked);
    const allIds = data.slice(sliced, end).map((user) => user.id);
    if (e.target.checked) {
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  }

  useEffect(() => {
    setSelectAll(false);
    setSelected([]);
  }, [currentPage, data]); 
  

  function handlePagination() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSlice(slice + 10);
      setRemove(removePrevious + 10);
    }
  }

  function handleDeleteSelected() {
    const updatedData = data.filter((user) => !selected.includes(user.id));
    setData(updatedData);
    setSelected([]);
  }

  function handlePaginationBackwards() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSlice(slice - 10);
      setRemove(removePrevious - 10);
    }
  }

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleSave() {
    if (editUserId !== null) {
      setSaved((prevSave) => ({
        ...prevSave,
        [editUserId]: { name: username, email: email, role: role },
      }));
    }
    setEdit(false);
    setEditUserId(null);
  }

  function handleDelete(id) {
    if (selected.length < 2 || !selected) {
      const updatedSingleData = data.filter((user) => user.id !== id);
      setData(updatedSingleData);
    } else {
      const updatedData = data.filter((user) => !selected.includes(user.id));
      setData(updatedData);
    }
    setSelected([]);
  }

  function handleSelected(e) {
    const selectedId = e.target.getAttribute("id");
    if (e.target.checked) {
      setSelected((prevSelected) => [...prevSelected, selectedId]);
    } else {
      setSelected((prevSelected) =>
        prevSelected.filter((id) => id !== selectedId)
      );
    }
  }

  const UsersData = async () => {
    try {
      const usersData = await Users();
      setData(usersData);
    } catch (err) {
      console.log(err);
    }
  };

  function handleEdit(id) {
    setEdit(true);
    setEditUserId(id);
    const user = data.find((user) => user.id === id);
    setUsername(user.name);
    setEmail(user.email);
    setRole(user.role);
  }

  useEffect(() => {
    UsersData();
  }, []);

  return (
    <div className="admin-container">
      <input
        type="search"
        onChange={handleSearch}
        className="search-input"
        placeholder="Search Users"
        value={search}
      />
      <table>
        <tbody>
          <tr>
            <th>
              <input
                id
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          {data
            .slice(removePrevious, slice)
            .filter(
              (user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.includes(search)
            )
            .map((user) => {
              return (
                <>
                  <tr
                    key={user.id}
                    className={
                      selected.includes(user.id) ? "checkedBackground" : ""
                    }
                  >
                    <td>
                      <input
                        type="checkbox"
                        id={user.id}
                        checked={selected.includes(user.id)}
                        onChange={handleSelected}

                        />
                    </td>
                    <td>
                      {edit && editUserId === user.id ? (
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      ) : save[user.id] ? (
                        save[user.id].name
                      ) : (
                        user.name
                      )}
                    </td>
                    <td>
                      {edit && editUserId === user.id ? (
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      ) : save[user.id] ? (
                        save[user.id].email
                      ) : (
                        user.email
                      )}
                    </td>
                    <td>
                      {edit && editUserId === user.id ? (
                        <input
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      ) : save[user.id] ? (
                        save[user.id].role
                      ) : (
                        user.role
                      )}
                    </td>
                    <td>
                      <button
                        className="cursorSelected"
                        onClick={() => handleEdit(user.id)}
                      >
                        Edit
                      </button>
                      {editUserId === user.id && (
                        <button className="cursorSelected" onClick={handleSave}>
                          Save
                        </button>
                      )}
                      <button
                        className="cursorSelected"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      <button className="cursorSelected" onClick={handleDeleteSelected}>
        Delete Selected
      </button>
      <div className="paginationBar">
        <div className="cursorSelected" onClick={handlePaginationBackwards}>
          Previous
        </div>
        <div className="paginationNumbers">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <span
                key={pageNumber}
                onClick={() => handlePageswithNum(pageNumber)}
              >
                {pageNumber}
              </span>
            )
          )}
        </div>
        <div className="cursorSelected" onClick={handlePagination}>
          Next
        </div>
      </div>
    </div>
  );
}
