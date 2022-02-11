import { ActionTree } from 'vuex';

import axios from 'axios';
import { api } from 'src/boot/axios';

import { StateInterface } from '../index';
import { ExampleStateInterface, StudentInterface } from './state';

const actions: ActionTree<ExampleStateInterface, StateInterface> = {
  async registerStudent(_, student: StudentInterface): Promise<{ status: boolean; msg: string }> {
    try {
      await api.post<{ name: string }>('/users.json', student);
      return { status: true, msg: 'Student registered successfully' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) console.log(error.response.data);
      return { status: false, msg: 'Error registering student' };
    }
  },
  async getStudentById({ commit }, id: string): Promise<{ status: boolean; msg: string }> {
    try {
      const { data } = await api.get<StudentInterface>(`/users/${id}.json`);
      commit('setStudent', data);
      return { status: true, msg: 'Student retrieved successfully' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) console.log(error.response.data);
      return { status: false, msg: 'Error retrieving student' };
    }
  },
  async updateStudent(_, payload: { id: string; form: StudentInterface }): Promise<{ status: boolean; msg: string }> {
    try {
      const { data } = await api.put<StudentInterface>(`/users/${payload.id}.json`, payload.form);
      console.log(data);
      return { status: true, msg: 'Student updated' };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) console.log(error.response.data);
      return { status: false, msg: 'Error updating student' };
    }
  },
};

export default actions;
