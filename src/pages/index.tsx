import Modal from "components/static/Modal";
import DeleteOutlined from "components/icons/deleteOutlined";
import EditOutlined from "components/icons/editOutlined";
import { useCallback, useMemo, useRef, useState } from "react";
import { getUsers } from "services/users";
import { user } from "types/index";
import * as styles from "utils/styles/tailwind";
import { Formik } from "formik";
import { userRole } from "./../constants/index";
import Select from "components/static/Select";
import * as Yup from "yup";
const Home = ({ usersList }: { usersList: user[] }) => {
  const theaders = ["Name", "Email", "Role", "Actions"];
  const [users, setUsers] = useState<user[] | []>([]);
  const [selectedUsersList, setSelectedUsersList] = useState<user[] | []>([])
  const [selectedUser, setSelectedUser] = useState<user | null>();
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const selectUserRef: any = useRef([]);
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
    let newUsersList = usersList.slice(start, end);
    setUsers(newUsersList);
  };
  const usersMemo = useMemo(() => getUsersList(page, limit), [page, limit]);
  const deleteUser = (userId: string) => {
    const filteredUser = users.filter((user) => user.id !== userId);
    setUsers(filteredUser);
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
    selectUserRef.current.forEach((element:any) => {
      if(checked){
        element.checked = true;
        setSelectedUsersList([...users])
      }else{
        element.checked = false
      }
    });
  };
  const addRef = (el:any) => {
    if(el && !selectUserRef.current.includes(el)){
      selectUserRef.current.push(el)
    }
  }
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Users</h1>
      <input
        type="text"
        className={styles.search}
        placeholder="Search by email or email"
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableCell}>
  <>
              {console.log(selectUserRef.current[0])}
              <input
                type="checkbox"
                onChange={(e) => handleSelectAllUsers(e.target.checked)}
                checked = {selectedUsersList.length === limit}
              />
              </>
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
                  <input type="checkbox" ref={addRef} checked={selectUserRef.current.checked}/>
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
      <button onClick={() => setPage((prev) => prev + 1)}>Next page</button>
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
