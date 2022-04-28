import adminFindCourse from "./admin/adminFindCourse";
import adminFindGroup from "./admin/adminFindGroup";
import adminFindUser from "./admin/adminFindUser";
import adminListCourses from "./admin/adminListCourses";
import adminListExers from "./admin/adminListExers";
import adminListGroups from "./admin/adminListGroups";
import adminListUsers from "./admin/adminListUsers";
import autoCourses from "./admin/AutoCourses";
import autoGroups from "./admin/AutoGroups";
import autoUsers from "./admin/AutoUsers";
import currentUser from "./auth/currentUser";

const Query = {
  currentUser,

  adminListUsers,
  adminFindUser,
  adminListGroups,
  adminFindGroup,
  adminListCourses,
  adminFindCourse,
  adminListExers,
  autoCourses,
  autoUsers,
  autoGroups,
};

export default Query;
