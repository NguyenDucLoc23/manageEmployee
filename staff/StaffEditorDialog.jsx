import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  MenuItem,
  DialogActions,
  DialogTitle,
  DialogContent,
  IconButton,
  Icon,
} from "@material-ui/core";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import {
  getProvince,
  getDistrictByProvince,
  getWardByDistrict,
  createStaff,
  saveStaff,
} from "./StaffService";
import "../../../styles/views/_loadding.scss";
import clsx from "clsx";
import CircularProgress from "@material-ui/core/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../styles/views/_style.scss";
toast.configure({
  autoClose: 1000,
  draggable: false,
  limit: 3,
});

class StaffEditorDialog extends Component {
  state = {
    listProvince: [],
    listDistrict: [],
    listWard: [],
    listStaffs: [],
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangePosition = (event, status) => {
    if (status === "province") {
      this.setState({
        provinceId: event?.target?.value,
        districtId: "",
        wardsId: "",
      });

      this.handleGetDistrict(event.target.value);
    }

    if (status === "district") {
      this.setState({
        districtId: event?.target?.value,
        wardsId: "",
      });

      this.handleGetWard(event.target.value);
    }

    if (status === "ward") {
      this.setState({
        wardsId: event?.target?.value,
      });
    }
  };

  handleFormSubmit = () => {
    let object = {
      name: this.state.name,
      phone: this.state.phone,
      email: this.state.email,
      code: this.state.code,
      age: this.state.age,
      wardsId: this.state.wardsId,
      provinceId: this.state.provinceId,
      districtId: this.state.districtId,
    };

    let listCode = [];
    listCode = this.state.listStaffs.filter(
      (item) => item.code === object.code
    );

    if (!this.props.item.id) {
      if (listCode.length > 0) {
        toast.warning("Trùng mã code của nhân viên khác");
      } else {
        createStaff(object).then(() => {
          toast.success("Thêm người dùng thành công");
          this.handleConfirmUpdate();
        });
      }
    } else {
      saveStaff(this.props.item.id, object).then(() => {
        toast.success("Cập nhật thông tin người dùng thành công");
        this.handleConfirmUpdate();
      });
    }
  };

  handleConfirmUpdate = () => {
    this.props.handleClose();
    this.props.getListNewData();
  };

  getPosition = () => {
    getProvince({}).then((res) => {
      this.setState({
        listProvince: res?.data?.data,
      });
    });
    if (this.props.item.provinceId) {
      this.handleGetDistrict(this.props.item.provinceId);
    }
    if (this.props.item.districtId) {
      this.handleGetWard(this.props.item.districtId);
    }
  };

  handleGetDistrict = (item) => {
    getDistrictByProvince(item).then((res) => {
      this.setState({
        listDistrict: res?.data?.data,
      });
    });
  }

  handleGetWard = (item) => {
    getWardByDistrict(item).then((res) => {
      this.setState({
        listWard: res?.data?.data,
      });
    });
  }

  getListData = () => {
    this.setState({
      listStaffs: this.props.listData,
    });
  };

  componentDidMount() {
    this.getPosition();
    this.getListData();
    this.setState({
      name: this.props.item.name ? this.props.item.name : "",
      phone: this.props.item.phone ? this.props.item.phone : "",
      email: this.props.item.email ? this.props.item.email : "",
      code: this.props.item.code ? this.props.item.code : "",
      age: this.props.item.age ? this.props.item.age : "",
      provinceId: this.props.item.provinceId ? this.props.item.provinceId : "",
      districtId: this.props.item.districtId ? this.props.item.districtId : "",
      wardsId: this.props.item.wardsId ? this.props.item.wardsId : "",
    });
  }

  render() {
    let { t, handleClose, open } = this.props;

    let {
      name,
      email,
      phone,
      code,
      age,
      loading,
      provinceId,
      districtId,
      wardsId,
    } = this.state;

    return (
      <Dialog open={open} fullWidth={true}>
        <div className={clsx("wrapperButton", !loading && "hidden")}>
          <CircularProgress className="buttonProgress" size={24} />
        </div>
        <DialogTitle
          style={{ cursor: "move", padding: "6px 12px" }}
          id="draggable-dialog-title"
        >
          <span className="mb-20 styleColor">
            {" "}
            {this.props.item.id
              ? "Cập nhật thông tin nhân viên"
              : "Thêm mới thông tin nhân viên"}{" "}
          </span>
          <IconButton
            style={{ position: "absolute", right: "10px" }}
            onClick={() => handleClose()}
          >
            <Icon color="error" title={t("close")}>
              close
            </Icon>
          </IconButton>
        </DialogTitle>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogContent dividers>
            <Grid className="mb-16" container spacing={1}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {t("user.displayName")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("Hãy nhập lại họ tên")]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Mã Nhân viên"}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required", "matchRegexp:^\\S{6,10}$"]}
                  errorMessages={[
                    "Hãy nhập lại mã nhân viên",
                    "Mã code phải có 6 đến 10 ký tự",
                  ]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Email"}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "Hãy nhập lại email",
                    "Hãy nhập đúng định dạng email",
                  ]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Số điện thoại"}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="phone"
                  value={phone}
                  validators={[
                    "required",
                    "isNumber",
                    "matchRegexp:^([0]{1}[0-9]{10})?$",
                  ]}
                  errorMessages={[
                    "Hãy nhập lại số điện thoại",
                    "Yêu cầu nhập số",
                    "Số điện thoại phải có ít nhất 11 chữ số và số 0 ở đầu",
                  ]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <TextValidator
                  className="w-100 mb-16"
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Tuổi"}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="age"
                  value={age}
                  validators={[
                    "required",
                    "isNumber",
                    "matchRegexp:^([0-9]{1}[0-9]{1})?$",
                  ]}
                  errorMessages={[
                    "Hãy nhập tuổi",
                    "Yêu cầu nhập số",
                    "Số tuổi không hợp lệ !!!",
                  ]}
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <SelectValidator
                  name="province"
                  value={provinceId}
                  fullWidth={true}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={["Chưa chọn Tỉnh/Thành phố"]}
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Tỉnh/Thành phố"}
                    </span>
                  }
                  onChange={(event) =>
                    this.handleChangePosition(event, "province")
                  }
                >
                  {this.state.listProvince.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </SelectValidator>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <SelectValidator
                  name="district"
                  value={districtId}
                  fullWidth={true}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={["Chưa chọn Quận/Huyện"]}
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Quận/Huyện"}
                    </span>
                  }
                  onChange={(event) =>
                    this.handleChangePosition(event, "district")
                  }
                >
                  {this.state.listDistrict.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </SelectValidator>
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12}>
                <SelectValidator
                  name="ward"
                  value={wardsId}
                  fullWidth={true}
                  variant="outlined"
                  size="small"
                  validators={["required"]}
                  errorMessages={["Chưa chọn Phường/Xã"]}
                  label={
                    <span className="font">
                      <span style={{ color: "red" }}> * </span>
                      {"Phường/Xã"}
                    </span>
                  }
                  onChange={(event) => this.handleChangePosition(event, "ward")}
                >
                  {this.state.listWard.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </SelectValidator>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            spacing={4}
            className="flex flex-end flex-middle"
            style={{ padding: "6px 21px" }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.props.handleClose()}
            >
              {t("Đóng")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
            >
              {t("Lưu")}
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}

export default StaffEditorDialog;
