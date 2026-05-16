/* =============================
src/modules/common/services.js
axios wrapper and generic CRUD
============================= */
import axios from "axios";
import { fetchUsers } from "../../../../server/controllers/userController";
const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: backendURL,
  withCredentials: true,
});

export default instance;
//  Global error handler
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(error);
  },
);

export const makeService = (
  resource,
  hasBulkDelete = false,
  hasRestore = false,
) => ({
  list: (params) => instance.get(`/${resource}`, { params }),
  get: (id) => instance.get(`/${resource}/${id}`),
  create: (data) => instance.post(`/${resource}`, data),
  update: (id, data) => instance.put(`/${resource}/${id}`, data),
  remove: (id) => instance.delete(`/${resource}/${id}`),
  ...(hasBulkDelete && {
    removeMany: (ids) => instance.delete(`/${resource}`, { data: { id: ids } }),
  }),

  ...(hasRestore && {
    restore: (id) => instance.put(`/${resource}/${id}`),

    restoreMany: (ids) => instance.put(`/${resource}`, { ids }),
  }),
});
