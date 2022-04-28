import login from "./auth/login";
import reg from "./auth/reg";
import resetPass from "./auth/resetPass";
import verifyResetPass from "./auth/verifyResetPass";
import updatePass from "./auth/updatePass";
import updateUser from "./auth/updateUser";

import adminApproveUser from "./admin/adminApproveUser";
import adminDeleteUsers from "./admin/adminDeleteUsers";
import adminEditUser from "./admin/adminEditUser";
import adminCreateUser from "./admin/adminCreateUser";

import adminCreateGroup from "./admin/adminCreateGroup";
import adminCreateCourse from "./admin/adminCreateCourse";
import adminDeleteCourses from "./admin/adminDeleteCourses";
import adminDeleteGroups from "./admin/adminDeleteGroups";
import adminEditGroup from "./admin/adminEditGroup";
import userCompleteCourse from "./user/userCompleteCourse";
import adminEditCourse from "./admin/adminEditCourse";

const Mutation = {
  login,
  reg,
  resetPass,
  verifyResetPass,
  updatePass,
  updateUser,

  userCompleteCourse,

  adminApproveUser,
  adminDeleteUsers,
  adminEditUser,
  adminCreateUser,

  adminCreateGroup,
  adminDeleteGroups,
  adminEditGroup,

  adminCreateCourse,
  adminDeleteCourses,
  adminEditCourse,
};

export default Mutation;
