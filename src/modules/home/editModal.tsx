import Modal from "components/static/Modal";
import { Formik } from "formik";
import { user } from "types";
import * as Yup from "yup";
import * as styles from 'utils/styles/tailwind'
import Select from "components/static/Select";
import { userRole } from './../../constants/index';

const EditModel = ({isOpen, handleClose, updateUser, title, ...rest}:any ) => {
    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string()
          .email("Invalid Email Address")
          .required("Email is required"),
      });
      const getInitialValues = () => {
        const initialValues: user = {
          id: String(rest.totalUsers + 1),
          name: "",
          email: "",
          role: "developer",
        };
        if (rest.selectedUser) {
          return rest.selectedUser;
        }
        return initialValues;
      };
    return (
        <Modal isOpen={isOpen} handleClose={handleClose} title={title}>
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
      )
}

export default EditModel