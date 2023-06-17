import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT;

export const deleteStaff = (id) => {
  return axios.delete(API_PATH + "/api/employees/" + id)
}

export const createStaff = (object) => {
  return axios.post(API_PATH + "/api/employees", object);
};

export const getProvince = (object) => {
  return axios.get(API_PATH + "/api/provinces/all", object);
};

export const getDistrictByProvince = async (id) => {
  return await axios.get(API_PATH + `/api/provinces/${id}/districts`)
}

export const getWardByDistrict = async (id) => {
  return await axios.get(API_PATH + `/api/districts/${id}/wards`)
}

export const searchByPage = (object) => {
  return axios.post(API_PATH + "/api/employees/page", object);
};

export const searchStaff = (searchTerm) => {
  const url = API_PATH + "/api/employees/page";
  return axios.post(url, searchTerm);
};

export const saveStaff = async (id, data) => {
  const url = API_PATH + '/api/employees/' +id
  return await axios.put(url,data)
}