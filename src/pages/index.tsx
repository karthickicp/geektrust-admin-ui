import Modal from "components/static/Modal";
import DeleteOutlined from "components/icons/deleteOutlined";
import EditOutlined from "components/icons/editOutlined";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getUsers } from "services/users";
import { user } from "types/index";
import * as styles from "utils/styles/tailwind";
import { Formik } from "formik";
import { userRole } from "./../constants/index";
import Select from "components/static/Select";
import * as Yup from "yup";
import Pagination from "components/static/Pagination";
import useDebounce from "hooks/useDebounce";
const Home = ({ usersList }: { usersList: user[] }) => {
  const [allUsers, setAllUsers] = useState(usersList)
  const theaders = ["Name", "Email", "Role", "Actions"];
  const [users, setUsers] = useState<user[] | []>([]);
  const [selectedUsersList, setSelectedUsersList] = useState<user[] | []>([]);
  const [selectedUser, setSelectedUser] = useState<user | null>();
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('')
  const selectUserRef: any = useRef([]);
  const selectAllUserRef: any = useRef(null);
  selectUserRef.current = []
  let limit = 10;
  const getInitialValues = () => {
    const initialValues: user = {
      id: String(users.length + 1),
      name: "",
      email: "",
      role: "developer",
    };
    if (selectedUser) {
      return selectedUser;
    }
    return initialValues;
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email is required"),
  });
  const closeModal = () => {
    setOpen(false);
  };
  const getUsersList = (page: number, limit: number) => {
    let start = (page - 1) * limit;
    let end = start + limit;
    let newUsersList = allUsers.slice(start, end);
    setUsers(newUsersList);
  };
  useEffect(() => {
    setSelectedUsersList([])
    getUsersList(page, limit);
  }, [page, limit, allUsers]);
  useEffect(() => {
    selectUserRef.current = selectUserRef.current.slice(0, users.length);
    return () => {
      selectUserRef.current = []
    }
  }, [users.length, page]);
  useEffect(()=>{
    if(selectAllUserRef.current){
    if(selectedUsersList.length > 0 && selectedUsersList.length < users.length){
      selectAllUserRef.current.indeterminate = true
    }else if(selectedUsersList.length === users.length){
      selectAllUserRef.current.indeterminate = false
    }else{
      selectAllUserRef.current.indeterminate = false
    }
  }},[selectedUsersList.length, page]);
  useEffect(() => {
    if(users.length === 0 && page !== 1){
     setPage(prev => prev -1)
    }
  },[users])
  useDebounce(() => searchUser(search),500,[search]);
  const deleteUser = (userId: string | user[]) => {
    let filteredUser;
    if(typeof userId === 'string'){
      filteredUser = allUsers.filter((user) => user.id !== userId);
    }else {
      filteredUser = allUsers.filter((user) => !userId.some(({ id }) => id === user.id));
    }
    setSelectedUsersList([])
    setAllUsers(filteredUser);
  };
  const editUser = async (user: user) => {
    await setSelectedUser(user);
    setOpen(true);
  };
  const updateUser = (values: user) => {
    let usersList = [...users];
    for (let i = 0; i < usersList.length; i++) {
      if (usersList[i].id === values.id) {
        usersList[i] = values;
        setUsers(usersList);
        break;
      }
    }
    setOpen(false);
  };
  const handleSelectAllUsers = (checked: boolean) => {
      if(checked){
        selectUserRef.current.forEach((elRef:any) => elRef.checked = true)
        setSelectedUsersList([...users])
      }else{
        selectUserRef.current.forEach((elRef:any) => elRef.checked = false)
        setSelectedUsersList([])
      }
    };

  const handleSelectedUser = async (checked: boolean, user:user) => {
    if(checked){
     await setSelectedUsersList(prevUsers => [...prevUsers, user]);
    }else{
      const filterList = selectedUsersList.filter((userData)=> user.id !== userData.id);
      setSelectedUsersList(filterList);
    } 
  }

  const searchUser = (searchVal: string) => {
    const result:any = [];
    if(searchVal === ''){
      setAllUsers(usersList)
      return result
    }
   for(let i = 0; i<allUsers.length; i++){
    if(allUsers[i].name.toLowerCase().includes(searchVal.toLowerCase()) ||
     allUsers[i].email.toLowerCase().includes(searchVal.toLowerCase())||
    allUsers[i].role.toLowerCase().includes(searchVal.toLowerCase())){
      result.push(allUsers[i])
    }
   }
    setAllUsers(result)
  }
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Users</h1>
      <input
        type="text"
        className={styles.search}
        placeholder="Search by name or email or role"
        value={search}
        onChange = {(e) => setSearch(e.target.value)}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableCell}>
              {users.length > 0 ? (
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAllUsers(e.target.checked)}
                  checked = {selectedUsersList.length === users.length}
                  ref={selectAllUserRef}
                />
              ): null}
              
            </th>
            {theaders.map((header) => (
              <th key={header} className={styles.tableCell}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td className={styles.tableCell}>
                  <input type="checkbox" ref={el => selectUserRef.current[index] = el} onChange={(e) =>handleSelectedUser(e.target.checked, user)}/>
                </td>
                <td className={styles.tableCell}>{user.name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
                <td className={styles.tableCell}>
                  <EditOutlined
                    className={styles.editIcon}
                    onClick={() => editUser(user)}
                  />
                  <DeleteOutlined
                    className={styles.deleteIcon}
                    onClick={() => deleteUser(user.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className={`${styles.tableCell} text-center`}>
                No Users Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className={styles.paginationWrapper}>
        <div>
          {selectedUsersList.length > 0 ? (
            <button className={styles.btnFilledPrimary} onClick={() => deleteUser(selectedUsersList)}>Delete User</button>
          ): null}
        </div>
        <Pagination list={allUsers} limit={limit} page={page} setCurrentPage={setPage}/>
      </div>
      
      <Modal isOpen={open} handleClose={closeModal} title="Edit User">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateUser(values);
          }}
        >
          {({ values, handleChange, handleSubmit, touched, errors }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className={styles.labelText}>
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className={styles.inputField}
                />
                {touched.name && errors.name && (
                  <p className={styles.errMsg}>{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={styles.labelText}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  value={values.email}
                  onChange={handleChange}
                  className={styles.inputField}
                />
                {touched.email && errors.email && (
                  <p className={styles.errMsg}>{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="role" className={styles.labelText}>
                  Role
                </label>
                <Select
                  value={values.role}
                  onChange={() => handleChange}
                  options={userRole}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button className={styles.btnTextPrimary}>Cancel</button>
                <button type="submit" className={styles.btnFilledPrimary}>
                  Update User
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

Home.getInitialProps = async () => {
  let usersList = await getUsers();
  return { usersList };
};

export default Home;
