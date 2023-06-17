import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const Staff = EgretLoadable({
  loader: () => import("./Staff")
});
const ViewComponent = withTranslation()(Staff);

const StaffRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"staff_manager/staff",
    exact: true,
    component: ViewComponent
  }
];

export default StaffRoutes;
