import React, { Component } from "react";
import {
  Grid,
  IconButton,
  Icon,
  Button,
  InputAdornment,
  Input,
  TablePagination,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import MaterialTable, { MTableToolbar } from "material-table";
import {
  deleteStaff,
  searchStaff,
  searchByPage,
} from "./StaffService";
import StaffEditorDialog from "./StaffEditorDialog";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MaterialButton(props) {
  const item = props.item;
  return (
    <div>
      <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
        <Icon fontSize="small" color="primary">
          edit
        </Icon>
      </IconButton>
      <IconButton onClick={() => props.onSelect(item, 1)}>
        <Icon color="error">delete</Icon>
      </IconButton>
    </div>
  );
}

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class Staff extends Component {

  state = {
    listStaff: [],
    shouldOpenConfirmationDialog: false,
    shouldOpenEditorDialog: false,
    item: {},
    keyword: "",
    rowsPerPage: 5,
    page: 0,
    totalElements: 0,
    reload: true,
  };

  handleOpenConfirmDelDialog = (id) => {
    this.setState({
      id,
      shouldOpenConfirmationDialog: true,
    });
  };

  handleCloseConfirmDelDialog = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
    });
  };

  handleDelete = () => {
    deleteStaff(this.state.id).then(() => {
      toast.success("Xóa thành công");
      this.setState({
        shouldOpenConfirmationDialog: false,
      });
      this.updatePageData();
    });
  };

  handleEditItem = () => {
    this.setState({
      item: {},
      shouldOpenEditorDialog: true,
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenEditorDialog: false,
      shouldOpenConfirmationDialog: false,
      shouldOpenConfirmationDeleteAllDialog: false,
    });
  };

  handleTextChange = (event) => {
    this.setState({ keyword: event.target.value }, function () {});
  };

  handleSearch = (keyword) => {
    searchStaff({ keyword }).then((response) => {
      this.setState({
        listStaff: response?.data?.data?.content,
      });
    });
  };

  closeSearch = () => {
    this.setState({
      keyword: "",
    });
    this.updatePageData();
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.pageIndex = this.state.page + 1;
    searchObject.pageSize = this.state.rowsPerPage;

    searchByPage(searchObject).then(({ data }) => {
      this.setState({
        listStaff: data?.data?.content,
        totalElements: data?.data?.totalElements,
      });
    });
  };

  setRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value, page: 0 }, function () {
      this.updatePageData();
    });
  };

  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (event, newPage) => {
    this.setPage(newPage);
  };

  componentDidMount() {
    this.updatePageData();
  }

  render() {
    const { t } = this.props;

    let {
      listStaff,
      shouldOpenConfirmationDialog,
      shouldOpenEditorDialog,
      item,
      keyword,
      rowsPerPage,
      page,
      totalElements,
    } = this.state;
    let columns = [
      {
        title: t("Hành động"),
        field: "custom",
        align: "left",
        width: "250",
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.setState({
                  shouldOpenEditorDialog: true,
                  item: rowData,
                });
              }
              if (method === 1) {
                this.handleOpenConfirmDelDialog(rowData.id);
              }
            }}
          />
        ),
      },
      { title: t("user.displayName"), field: "name", width: "150" },
      { title: t("Mã nhân viên"), field: "code", align: "left", width: "150" },
      { title: t("Số điện thoại"), field: "phone", width: "150" },
      {
        title: t("general.email"),
        field: "email",
        align: "left",
        width: "150",
      },
    ];

    return (
      <div className="m-sm-30 mb-0">
        {/* Title và thanh trạng thái */}
        <div className="mb-sm-30">
          <Breadcrumb
            routeSegments={[
              { name: t("Quản lý nhân viên L1"), path: "/directory/apartment" },
              { name: t("Nhân viên L1") },
            ]}
          />
        </div>

        <Grid container spacing={3}>
          <Grid item lg={9} md={5} sm={5} xs={12}>
            {/* Button thêm mới */}
            <Button
              className="mb-16 mr-16 align-bottom"
              variant="contained"
              color="primary"
              onClick={() => {
                this.handleEditItem();
              }}
            >
              {t("Add")}
            </Button>
          </Grid>

          {/* Thanh tìm kiếm */}
          <Grid item lg={3} md={7} sm={7} xs={12}>
            <Input
              label={t("EnterSearch")}
              type="text"
              name="keyword"
              value={keyword}
              onChange={this.handleTextChange}
              //onKeyDown={this.handleKeyDownEnterSearch}
              className="w-100 mb-16 mr-10 stylePlaceholder"
              id="search_box"
              placeholder={t("general.enterSearch")}
              // sx = {{width: '100px'}}
              startAdornment={
                <InputAdornment>
                  <Link to="#">
                    <SearchIcon
                      onClick={() => this.handleSearch(keyword)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "25",
                      }}
                    />
                  </Link>
                  <Link to="#">
                    <CloseIcon
                      onClick={() => this.closeSearch()}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                      }}
                    />
                  </Link>
                </InputAdornment>
              }
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {shouldOpenEditorDialog && (
            <StaffEditorDialog
              t={t}
              handleClose={this.handleDialogClose}
              open={shouldOpenEditorDialog}
              item={item}
              getListNewData={this.updatePageData}
              listData={this.state.listStaff}
            />
          )}

          {shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={shouldOpenConfirmationDialog}
              onConfirmDialogClose={this.handleCloseConfirmDelDialog}
              onYesClick={this.handleDelete}
              text={t("DeleteConfirm")}
              Yes={t("Đồng ý")}
              No={t("Từ chối")}
            />
          )}

          <MaterialTable
            // className="h-500"
            title={""}
            data={listStaff}
            columns={columns}
            components={{
              Toolbar: (props) => <MTableToolbar {...props} />,
            }}
            onSelectionChange={(rows) => {
              this.setState({ selectedItems: rows });
            }}
            options={{
              sorting: true,
              selection: false,
              actionsColumnIndex: -1,
              paging: false,
              search: false,
              rowStyle: (rowData, index) => ({
                backgroundColor: index % 2 === 1 ? "#EEE" : "#FFF",
              }),
              maxBodyHeight: "650px",
              minBodyHeight: "450px",
              headerStyle: {
                backgroundColor: "#358600",
                color: "#fff",
              },
              padding: "dense",
              toolbar: false,
            }}
            localization={{
              body: {
                emptyDataSourceMessage: `${t("general.emptyDataMessageTable")}`,
              },
            }}
          />

          <TablePagination
            align="left"
            className="px-16"
            rowsPerPageOptions={[1, 2, 3, 5, 10, 25, 50, 100]}
            component="div"
            labelRowsPerPage={t("Số bản ghi mỗi trang")}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t("general.of")} ${
                count !== -1 ? count : `more than ${to}`
              }`
            }
            count={totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.setRowsPerPage}
          />
        </Grid>
      </div>
    );
  }
}

export default Staff;
